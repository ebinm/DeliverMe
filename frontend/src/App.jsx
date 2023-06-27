import React from "react";
import Header from "./components/Header";
import {BuyerMyOrders} from "./components/MyOrders/BuyerMyOrders";
import {ShopperMyOrders} from "./components/MyOrders/ShopperMyOrders";
import CheckoutForm from "./components/payprovider/CheckoutPage";
import {Route, Routes} from "react-router-dom";
import {TestExample} from "./components/TestExample";
import {ShopperChooseOrderView} from "./components/ShopperChooseOrder/ShopperChooseOrderView";
import {Signup} from "./components/authentication/Signup";
import {CustomerProvider} from "./util/context/CustomerContext";
import {Login} from "./components/authentication/Login";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {NotificationProvider} from "./util/context/NotificationContext";
import {SnackbarProvider} from 'notistack';
import {BuyerOrderCreationView} from "./components/BuyerOrderCreation/BuyerOrderCreationView";
import LandingPage from "./components/landingPage/LandingPage";
import './App.css';

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

                                <Route path={"/shopper/my-orders/:id?"} element={<ShopperMyOrders/>}/>
                                <Route path={"/shopper/browseorders"} element={<ShopperChooseOrderView/>}/>

                                <Route path={"/buyer/my-orders/:id?"} element={<BuyerMyOrders/>}/>
                                <Route path={"/buyer/order/create/*"} element={<BuyerOrderCreationView/>}/>
                                <Route path={"/checkout"} element={<CheckoutForm/>}/>

                                <Route path={"test"} element={<TestExample/>}/>
                            </Routes>
                        </main>
                    </LocalizationProvider>
                </NotificationProvider>
            </SnackbarProvider>
        </CustomerProvider>
    );
}

export default App;
