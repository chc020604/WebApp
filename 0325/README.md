# 4주차 수업 내용

**index.html**
> * public 폴더에 있다.
> * 메인 프로그램인 index.js에 대응되는 것으로, HTML 템플릿 파일이다.
> * 이 파일이 직접 표시되는 것은 아니고, index.js에 의해 읽어 와서 렌더링된 결과가 표시된다. (index.html 이름을 바꿀 시 오류발생)

**index.js**
> * src 폴더에 포함되어 있다. 메인 프로그램이라고 할 수 있다.
>* 여기에서 HTML 템플릿 및 JavaScript의 컴포넌트를 조합하여 렌더링하고 실제 표시한다

**App.js**
> * src 폴더에 있다.
> * 이것은 컴포넌트를 정의하는 프로그램이다.
> * 실제로 화면에 표시되는 내용 등은 여기에서 정의된다.

### Element
> * React에서 Element는 UI의 가장 작은 단위이며, 화면에 표시될 내용을 담고 있는 JavaScript 객체입니다.
Element는 HTML의 요소와 비슷하지만, 실제 DOM 요소가 아닌 가상 DOM(Virtual DOM)에 존재하는 객체입니다.

> * <> </> => Element , 태그 안에 있는 것 => contents

### Component
> * Element를 생성하고 관리하는 함수 또는 클래스
> * Component는 재사용 가능하며, 독립적인 기능을 수행하는 UI의 특정 부분을 나타냄
> * 함수형 컴포넌트와 클래스형 컴포넌트가 있다.
>   * 클래스형은 과거 기술이기에 함수형 컴포넌트를 사용하는것이 좋다

**함수형 컴포넌트**
```js
function Welcome() {
    return <h1>Hello, React Component!</h1>;
}
```

**클래스형 컴포넌트**
```js
class Welcome extends React.Component {
    render() {
        return <h1>Hello, React Component!</h1>;
    }
}

```

**컴포넌트에서 여러 엘리먼트 반환하기**
```js
function App() {
    return (
        <div>
            <h1>Hello!</h1>
            <p>This is a React Component.</p>
        </div>
    );
}
```

> * **Element는 Component에 의해 생성되고, Component는 Element들을 조합하여 UI를 구성한다**
> ---
> * **Element는 UI의 가장 작은 단위이며, Component는 이러한 Element들을 묶어 재사용 가능한 UI 모듈을 만듦**

### Rendering
1. 초기 렌더링:
    * 리액트 애플리케이션이 처음 실행되면, 컴포넌트가 렌더링되고 가상 DOM이 생성됩니다.
    * 이 가상 DOM은 실제 DOM에 반영되기 전에 메모리 내에서 구성됩니다.
    * Virtual DOM을 생성하고, 이를 기반으로 실제 DOM을 만들어 브라우저에 렌더링됩니다.
2. 상태 변화:
    * 컴포넌트의 상태(state)나 속성(props)이 변경되면, 리액트는 해당 컴포넌트를 다시 렌더링하여 새로운 가상 DOM을 생성합니다.
3. 비교(디프):
    * 리액트는 이전 가상 DOM과 새로운 가상 DOM을 비교하여 어떤 부분이 변경되었는지를 확인합니다.
    * 이 과정을 "디프(Diffing)"라고 합니다.
    * 이 과정에서 리액트는 변경된 부분만을 찾아내어 실제 DOM에 최소한의 변경을 적용합니다.
4. 업데이트:
    * 변경된 부분이 확인되면, 리액트는 실제 DOM을 업데이트합니다. 이때, 필요한 경우에만 DOM 조작을 수행하여 성능을 최적화합니다.

### React DOM Node
> * "Root DOM node"는 웹 애플리케이션에서 React와 같은 라이브러리를 사용하여 컴포넌트를 렌더링할 때, 해당 컴포넌트가 마운트되는 최상위 DOM 요소를 의미합니다. 일반적으로 HTML 파일에서 <div> 태그로 정의됨
```html
<!-- React 애플리케이션의 시작점 역할을 한다 -->
<div id=“root”><div>
```

### 레포트
* lovable 포트폴리오 사이트 만들기
* vercel로 배포하기

### 발표 준비
* Javascript Function (자바스크립트 함수 발표)
* 일급 함수 내용이 꼭 들어가야함

