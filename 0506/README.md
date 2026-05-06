
**버전**: 0.0.0

**작성일**: 2026-05-06

**팀**: 3인 팀 프로젝트

**상태**: Ready for Development

---

## 1. 개요 (Overview)

### 1-1. 프로젝트 한 줄 정의

> "영수증 촬영 한 번으로 항목별 텍스트를 추출하고, 조건부(비음주자 등) 분할 계산부터 카카오톡 송금 요청까지 원스톱으로 해결하는 **스마트 정산 플랫폼**"
> 

### 1-2. 문제 정의 (Problem Statement)

- **총무의 고통**: 모임 후 긴 영수증을 보며 일일이 계산기를 두드리고 인원수로 나누는 과정이 번거로움.
- **불공평한 N빵**: "나는 술 안 마셨는데 술값까지 N빵해야 하나?"라는 불만이 존재하지만, 항목별로 나누기엔 계산이 너무 복잡함.
- **정산 독촉의 민망함**: 돈 달라고 매번 카톡을 보내고, 누가 냈는지 안 냈는지 장부(Excel)를 관리하는 것이 스트레스.

### 1-3. 핵심 해결책 (Solution)

- Google Vision API (OCR)를 활용해 영수증 이미지에서 품목과 금액을 JSON 형태로 자동 파싱.
- **항목별 개별 매핑 시스템**을 통해 특정 메뉴(예: 소주)는 특정 인원(술 마신 사람)에게만 분할되도록 DB 로직 설계.
- 정산 링크와 카카오페이/토스 딥링크를 카카오톡 메시지로 자동 발송.

---

## 2. 시스템 아키텍처 & 기술 스택 (System Architecture & Tech Stack)

| **레이어** | **기술 스택** | **도입 목적 (명분)** |
| --- | --- | --- |
| **Frontend** | React (Vite), Zustand, Tailwind CSS | 모바일 웹뷰 환경 최적화, Zustand를 활용한 영수증-참여자 간 복잡한 전역 상태 관리 |
| **Backend** | **Spring Boot 3.x (Java 17)** | REST API 서버 및 정산 로직 처리 |
| **Database** | MySQL 8.0 | 돈이 오가는 정산 데이터이므로 **ACID 무결성**과 테이블 간의 복잡한 **JOIN**이 필수적임 |
| **AI / API** | Google Cloud Vision API (OCR), Kakao Message API | 영수증 텍스트 추출, 정산 요청 메시지 및 딥링크 발송 |
| **Infra** | AWS EC2, S3, RDS, GitHub Actions | S3에 원본 영수증 저장, RDS로 DB 분리, CI/CD 자동화로 배포 안정성 확보 |

---

## 3. 데이터베이스 설계 (ERD & Schema)

> **차별화 포인트**: 정산(Settlement)-품목(Item)-참여자(Participant) 간의 **다대다(N:M) 매핑 테이블**을 설계하여 '조건부 N빵(술 안 마신 사람 빼기)'을 기술적으로 구현.
> 

### 3-1. 핵심 테이블 명세

### 1. `users` (총무/유저 정보)

| **컬럼명** | **타입** | **제약조건** | **설명** |
| --- | --- | --- | --- |
| id | INT | PK, Auto Increment | 고유 유저 ID |
| kakao_id | VARCHAR | UNIQUE | 카카오 소셜 로그인 식별자 |
| bank_name | VARCHAR |  | 주거래 은행명 |
| account_num | VARCHAR |  | 정산받을 계좌번호 |

### 2. `settlements` (정산 방/영수증 단위)

| **컬럼명** | **타입** | **제약조건** | **설명** |
| --- | --- | --- | --- |
| id | INT | PK, Auto Increment | 정산 방 ID |
| host_id | INT | FK (users.id) | 총무(방장) ID |
| receipt_image_url | VARCHAR |  | AWS S3에 저장된 영수증 이미지 URL |
| total_amount | INT | NOT NULL | 영수증 총 결제 금액 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 정산 생성일 |

### 3. `participants` (정산 참여자)

| **컬럼명** | **타입** | **제약조건** | **설명** |
| --- | --- | --- | --- |
| id | INT | PK, Auto Increment | 참여자 고유 ID |
| settlement_id | INT | FK (settlements.id) | 어느 정산 방에 속해있는가 |
| name | VARCHAR | NOT NULL | 참여자 이름 (예: 김철수) |
| is_paid | BOOLEAN | DEFAULT FALSE | 입금 완료 여부 체크 |

### 4. `items` (영수증 내 세부 품목)

| **컬럼명** | **타입** | **제약조건** | **설명** |
| --- | --- | --- | --- |
| id | INT | PK, Auto Increment | 품목 ID |
| settlement_id | INT | FK (settlements.id) |  |
| item_name | VARCHAR | NOT NULL | 품목명 (예: 참이슬) |
| price | INT | NOT NULL | 해당 품목의 금액 (예: 5000) |

### 5. `item_participant_mappings` (핵심 매핑 테이블 - 누가 뭘 먹었나)

| **컬럼명** | **타입** | **제약조건** | **설명** |
| --- | --- | --- | --- |
| item_id | INT | FK (items.id) | 품목 ID |
| participant_id | INT | FK (participants.id) | 이 품목을 먹은/부담할 사람 ID |

> **동작 로직**: '참이슬(5000원)' 항목에 A, B, C 세 명이 매핑되어 있다면, 백엔드 계산 로직에서 5000원을 3으로 나누어 각각의 최종 정산액에 합산.
> 

---

## 4. 데이터 플로우 & OCR 알고리즘 (Data Flow)

### 4-1. 영수증 처리 파이프라인

1. **Client**: 영수증 촬영 후 `FormData`로 이미지 서버 전송.
2. **Server** : 이미지를 AWS S3에 업로드 후 URL 확보.
3. **OCR 연동**: S3 URL을 Google Cloud Vision API로 전송하여 Raw Text(Bounding Box 데이터) 수신.
4. **Data Parsing (정규식/로직)**:
    - `품목명` + `금액` 패턴(예: "치킨 20,000")을 정규표현식으로 추출.
    - 파싱된 데이터를 프론트엔드로 JSON 응답 (유저가 틀린 부분 수정할 수 있도록).
5. **DB Transaction**: 유저가 수정을 완료하고 '정산 생성'을 누르면 `settlements`, `items`, `participants` 테이블에 트랜잭션(Transaction)으로 동시 INSERT. (하나라도 실패 시 롤백하여 돈 계산 오류 방지)

---

## 5. 핵심 API 명세서 (API Specification)

### `POST /api/v1/ocr/scan`

- **설명**: 영수증 이미지를 분석하여 품목과 금액을 반환.
- **Request**: `multipart/form-data` (image: File)
- **Response**:

```json
{
  "status": "success",
  "data": {
    "total_amount": 45000,
    "store_name": "교촌치킨 강남점",
    "items": [
      { "name": "허니콤보", "price": 20000 },
      { "name": "생맥주 500cc", "price": 25000 }
    ]
  }
}
```

### `POST /api/v1/settlements`

- **설명**: 확정된 정산 내역과 참여자 정보를 DB에 저장하고, 각자의 할당 금액을 계산.
- **Request**:

```json
{
  "host_id": 1,
  "total_amount": 45000,
  "participants": ["홍길동", "김철수", "이영희"],
  "items": [
    { 
      "name": "허니콤보", "price": 20000, 
      "shared_by": ["홍길동", "김철수", "이영희"] // 3명이 1/n
    },
    { 
      "name": "생맥주 500cc", "price": 25000, 
      "shared_by": ["김철수", "이영희"] // 2명이 1/n (홍길동 제외)
    }
  ]
}
```

---

---

## 6. 예외 처리 및 에러 핸들링 (Risk Management)

1. **OCR 파싱 실패/오류**: 영수증이 구겨져 총액 합산이 맞지 않을 경우, 프론트엔드에서 `Items 금액 총합 != Total 금액`을 감지하여 붉은색 경고 UI 노출 및 수동 수정 강제.
2. **트랜잭션 롤백 (DB)**: 정산 방 생성 중 네트워크 오류로 `participants`는 저장되었으나 `items`가 저장되지 않는 데이터 불일치 방지를 위해 SQL 트랜잭션(`BEGIN` ~ `COMMIT/ROLLBACK`) 적용.
3. **단수(짜투리) 금액 처리**: 10,000원을 3명이 나눌 때 3,333.33원이 나오는 문제 해결. 총무가 짜투리를 부담하거나, 내림/올림 옵션을 선택할 수 있는 로직 구현 (`Math.floor` 활용).

---

## 7. 디렉토리 구조 (FDD: Feature-Driven Development)

- 프론트: 도메인/기능 중심(Feature-driven) 폴더 구조를 채택.

```
src/
 ├── features/
 │    ├── auth/          # 로그인, 유저 정보 관련
 │    ├── ocr/           # 카메라 촬영, 업로드, OCR 파싱 로직
 │    ├── settlement/    # N빵 계산 로직, 금액 분배 UI
 │    └── share/         # 카카오 API 연동, 링크 생성
 ├── shared/
 │    ├── components/    # 공통 UI (Button, Modal, Toast)
 │    ├── utils/         # 유틸 함수 (calculateSplit.js, formatCurrency.js)
 │    └── hooks/         # 공통 커스텀 훅
 ├── pages/              # 라우팅 단위 페이지 컴포넌트
 └── App.jsx
```

- 백엔드

```
src/main/java/com/snapsplit/
 ├── global/
 │    ├── config/            # Security, QueryDSL, Swagger 설정
 │    ├── error/             # GlobalExceptionHandler, CustomException
 │    └── common/            # BaseEntity, S3Uploader, OCRClient
 ├── domain/
 │    ├── member/            # 회원 도메인 (Entity, Controller, Service)
 │    ├── settlement/        # 정산 방 도메인
 │    ├── item/              # 품목 및 N:M 매핑 로직 도메인
 │    └── message/           # 카카오 알림톡 발송 서비스
 └── dto/                    # Request/Response 객체 (Domain별 분리 권장)
```

---

### 8. 정산 로직 고도화

- **8-1. 공통 비용(봉사료/배달비) 안분 계산**:
    - 특정 메뉴에 매핑되지 않은 '공통 비용'은 개별 결제 금액에 비례(Proportional)하여 나눌지, 평균(Flat)으로 나눌지 선택 옵션 제공.
- **8-2. 입금 확인 자동화**:
    - 실제 뱅킹 API 연동은 까다로우므로, 총무가 카톡 알림을 받았을 때 '입금 확인' 버튼을 누르면 해당 유저의 `is_paid`가 `true`로 변경되도록 구현.
- **8-3. 배치(Batch) 처리 고려**:
    - 정산 내역이 900건 이상 쌓일 경우를 대비해, 오래된 정산 내역은 인덱싱(Indexing) 처리를 통해 조회 성능 최적화.

---

### 9. 테스트 전략 (품질 관리)

- **JUnit5 기반 단위 테스트**:
    - '3명이 10,000원을 나눌 때 1원 단위 오차 발생 여부'
    - '술을 안 마신 사람을 제외했을 때 합계가 총액과 일치하는지'
    - 위 케이스들을 **비즈니스 로직(Service 레이어) 테스트**로 반드시 검증.