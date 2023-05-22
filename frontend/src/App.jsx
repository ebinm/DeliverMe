import React from "react";
import Header from "./components/Header";
import {Route, Routes} from "react-router-dom";


function App() {
  return (
    <main>
      <Header/>
        <Routes>
            <Route path={"/"} element={"Hi, I am home"}/>
            <Route path={"/login"} element={"Hi, I am login"}/>
            <Route path={"/personal-shopper/signup"} element={"Hi, I am Personal Shopper Sign-in"}/>
        </Routes>
    </main>
  );
}

export default App;
