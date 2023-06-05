import React from "react";
import Header from "./components/Header";
import {BuyerMyOrders} from "./components/MyOrders/BuyerMyOrders";
import {ShopperMyOrders} from "./components/MyOrders/ShopperMyOrders";
import {Route, Routes} from "react-router-dom";
import {BuyerChooseShopView} from "./components/BuyerChooseShop/BuyerChooseShopView";
import {TestExample} from "./components/BuyerChooseShop/TestExample";
import TestExample from "./components/BuyerOrderCreation/BuyerChooseShop/TestExample";
import {Signup} from "./components/authentication/Signup";
import {CustomerProvider} from "./util/context/CustomerContext";
import {Login} from "./components/authentication/Login";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {NotificationProvider} from "./util/context/NotificationContext";
import  {ShopperChooseOrderView} from "./components/ShopperChooseOrder/ShopperChooseOrderView";
import {SnackbarProvider}  from 'notistack';
import {BuyerOrderCreationView} from "./components/BuyerOrderCreation/BuyerOrderCreationView";
import LandingPage from "./components/landingPage/LandingPage";


function App() {
    return (
        <CustomerProvider>
            <SnackbarProvider>
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
                            <Route path={"/"} element={"Hi, I am home"}/>
                            <Route path={"/map-shop"} element={<BuyerChooseShopView/>}/>
                            <Route path={"/map-order"} element={<ShopperChooseOrderView/>}/>
                            <Route path={"/test"} element={<TestExample/>}/>
                            <Route path={"/buyer/order/create/*"} element={<BuyerOrderCreationView/>}/>
                        </Routes>
                    </main>
                </LocalizationProvider>
            </NotificationProvider>
            </SnackbarProvider>
        </CustomerProvider>
    );
}

export default App;
