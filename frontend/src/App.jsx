import React from "react";
import Header from "./components/Header";
import {BuyerMyOrders} from "./components/MyOrders/BuyerMyOrders";
import {ShopperMyOrders} from "./components/MyOrders/ShopperMyOrders";
import {Route, Routes} from "react-router-dom";
import {BuyerChooseShopView} from "./components/BuyerChooseShop/BuyerChooseShopView";
import TestExample from "./components/BuyerChooseShop/TestExample";
import {Signup} from "./components/authentication/Signup";
import {CustomerProvider} from "./util/context/CustomerContext";
import {Login} from "./components/authentication/Login";
import {ShopperChooseOrderView} from "./components/ShopperChooseOrder/ShopperChooseOrderView";
import { SnackbarProvider} from 'notistack';


function App() {
    return (
        <CustomerProvider>
            <Header/>
            <main>
            <SnackbarProvider maxSnack={3}>
                <Routes>
                    <Route path={"/"} element={"Hi, I am home"}/>
                    <Route path={"/shopper/signup"} element={<Signup type={"shopper"}/>}/>
                    <Route path={"/buyer/signup"} element={<Signup type={"buyer"}/>}/>
                    <Route path={"/login"} element={<Login/>}/>
                    <Route path={"/buyer/my-orders"} element={<BuyerMyOrders/>}/>
                    <Route path={"/shopper/my-orders"} element={<ShopperMyOrders/>}/>
                    <Route path={"/"} element={"Hi, I am home"} />
                    <Route path={"/map"} element={<BuyerChooseShopView/>} />
                    <Route path={"/ordermap"} element={<ShopperChooseOrderView/>} />
                    <Route path={"/test"} element={<TestExample />} />
                    <Route path={"/shopper/signup"} element={<Signup type={"shopper"} />} />
                    <Route path={"/buyer/signup"} element={<Signup type={"buyer"} />} />
                    <Route path={"/login"} element={<Login />} />
                </Routes>
                </SnackbarProvider>
            </main>
        </CustomerProvider>
    );
}

export default App;
