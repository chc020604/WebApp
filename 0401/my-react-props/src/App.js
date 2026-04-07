import React, { Component } from "react";
import Header from "./funcComp/Header";
import Footer from "./funcComp/Footer";
import Main from "./funcComp/Main";
import Wrapper from "./funcComp/Wrapper";
function App() {
  return (
    <div>
      <Header />
      <Wrapper>
        <Main color="blue" />
      </Wrapper>
      <Footer />
    </div>
  );
}
export default App;
