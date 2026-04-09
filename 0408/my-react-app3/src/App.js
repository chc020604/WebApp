import React, { useState } from 'react';

export default function TabMenu() {
  const [tab, setTab] = useState(1);

  return (
    <div>
      <button onClick={() => setTab(1)}>Kname</button>
      <button onClick={() => setTab(2)}>Ename</button>
      
      <div>
        {tab === 1 
          ? "조현창" 
          : "Cho Hyeonchang."}
      </div>
    </div>
  );
}