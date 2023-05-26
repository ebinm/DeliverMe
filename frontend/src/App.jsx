import React from "react";
import Header from "./components/Header";
import {Route, Routes} from "react-router-dom";
import {Signup} from "./components/authentication/Signup";
import {CustomerProvider} from "./util/context/CustomerContext";
import {Login} from "./components/authentication/Login";


function App() {
    return (
        <CustomerProvider>
            <Header/>
            <main>
                <Routes>
                    <Route path={"/"} element={"Hi, I am home"}/>
                    <Route path={"/shopper/signup"} element={<Signup type={"shopper"}/>}/>
                    <Route path={"/buyer/signup"} element={<Signup type={"buyer"}/>}/>
                    <Route path={"/login"} element={<Login/>}/>
                </Routes>
            </main>
        </CustomerProvider>
    );
}

export default App;
