import React from "react";
import Header from "./components/Header";
import {BuyerMyOrders} from "./components/MyOrders/BuyerMyOrders";
import {ShopperMyOrders} from "./components/MyOrders/ShopperMyOrders";
import {Route, Routes} from "react-router-dom";
import TestExample from "./components/BuyerOrderCreation/BuyerChooseShop/TestExample";
import {Signup} from "./components/authentication/Signup";
import {CustomerProvider} from "./util/context/CustomerContext";
import {Login} from "./components/authentication/Login";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {NotificationProvider} from "./util/context/NotificationContext";
import {BuyerOrderCreationView} from "./components/BuyerOrderCreation/BuyerOrderCreationView";
import LandingPage from "./components/landingPage/LandingPage";


function App() {
    return (
        <CustomerProvider>
            <NotificationProvider>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Header/>
                    <main>
                        <Routes>
                            <Route path={"/"} element={<LandingPage/>}/>
                            <Route path={"/shopper/signup"} element={<Signup type={"shopper"}/>}/>
                            <Route path={"/buyer/signup"} element={<Signup type={"buyer"}/>}/>
                            <Route path={"/login"} element={<Login/>}/>
                            <Route path={"/buyer/my-orders"} element={<BuyerMyOrders/>}/>
                            <Route path={"/shopper/my-orders"} element={<ShopperMyOrders/>}/>
                            <Route path={"/"} element={<LandingPage/>}/>
                            <Route path={"/test"} element={<TestExample/>}/>
                            <Route path={"/buyer/order/create/*"} element={<BuyerOrderCreationView/>}/>
                        </Routes>
                    </main>
                </LocalizationProvider>
            </NotificationProvider>
        </CustomerProvider>
    );
}

export default App;
