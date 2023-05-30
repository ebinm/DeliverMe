import React from "react";
import Header from "./components/Header";
import {BuyerMyOrders} from "./components/MyOrders/BuyerMyOrders";
import {ShopperMyOrders} from "./components/MyOrders/ShopperMyOrders";
import {Route, Routes} from "react-router-dom";
import MapWithList from "./components/BuyerChooseShop/BuyerChooseShopView";
import TestExample from "./components/BuyerChooseShop/TestExample";
import {Signup} from "./components/authentication/Signup";
import {CustomerProvider} from "./util/context/CustomerContext";
import {Login} from "./components/authentication/Login";
import LandingPage from "./components/landingPage/LandingPage";


function App() {
    return (
        <CustomerProvider>
            <Header/>
            <main>
                <Routes>
                    <Route path={"/"} element={<LandingPage/>}/>
                    <Route path={"/shopper/signup"} element={<Signup type={"shopper"}/>}/>
                    <Route path={"/buyer/signup"} element={<Signup type={"buyer"}/>}/>
                    <Route path={"/login"} element={<Login/>}/>
                    <Route path={"/buyer/my-orders"} element={<BuyerMyOrders/>}/>
                    <Route path={"/shopper/my-orders"} element={<ShopperMyOrders/>}/>
                    <Route path={"/"} element={"Hi, I am home"} />
                    <Route path={"/map"} element={<MapWithList />} />
                    <Route path={"/test"} element={<TestExample />} />
                    <Route path={"/shopper/signup"} element={<Signup type={"shopper"} />} />
                    <Route path={"/buyer/signup"} element={<Signup type={"buyer"} />} />
                    <Route path={"/login"} element={<Login />} />
                </Routes>
            </main>
        </CustomerProvider>
    );
}

export default App;
