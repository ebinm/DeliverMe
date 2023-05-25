import React from "react";
import Header from "./components/Header";
import {Route, Routes} from "react-router-dom";
import {SignupShopper} from "./components/authentication/SignupShopper";
import {CustomerProvider} from "./util/context/CustomerContext";
import {Login} from "./components/authentication/Login";


function App() {
    return (
        <CustomerProvider>
            <Header/>
            <main>
                <Routes>
                    <Route path={"/"} element={"Hi, I am home"}/>
                    <Route path={"/personal-shopper/signup"} element={<SignupShopper/>}/>
                    <Route path={"/login"} element={<Login/>}/>
                </Routes>
            </main>
        </CustomerProvider>
    );
}

export default App;
