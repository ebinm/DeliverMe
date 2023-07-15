import React from "react";
import Header from "./components/Header";
import {BuyerMyOrders} from "./components/MyOrders/BuyerMyOrders";
import {ShopperMyOrders} from "./components/MyOrders/ShopperMyOrders";
import {CheckoutPage} from "./components/payprovider/CheckoutPage";
import {Route, Routes} from "react-router-dom";
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
import {PersonalProfile} from "./components/PersonalProfile/PersonalProfile";
import {styled} from '@mui/material/styles';


const StyledSnackbarProvider = styled(SnackbarProvider)``;

function App() {

    return (
            <CustomerProvider>
                <StyledSnackbarProvider
                    maxSnack={3}

                    sx={{
                        fontSize: 16,
                        fontFamily: 'Roboto, sans-serif'
                    }}
                >
                    <NotificationProvider>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <Header/>
                            <main>
                                <Routes>
                                    <Route path={"/"} element={<LandingPage/>}/>
                                    <Route path={"/shopper/signup"} element={<Signup type={"shopper"}/>}/>
                                    <Route path={"/buyer/signup"} element={<Signup type={"buyer"}/>}/>
                                    <Route path={"/login"} element={<Login/>}/>


                                    <Route path={"/shopper/my-orders/:id?/:action?"} element={<ShopperMyOrders/>}/>
                                    <Route path={"/buyer/my-orders/:id?/checkout"} element={<CheckoutPage/>}/>
                                    <Route path={"/buyer/my-orders/:id?/:action?"} element={<BuyerMyOrders/>}/>

                                    <Route path={"/shopper/browseorders"} element={<ShopperChooseOrderView/>}/>
                                    <Route path={"/buyer/order/create/*"} element={<BuyerOrderCreationView/>}/>
                                    <Route path={"/me"} element={<PersonalProfile/>}/>
                                </Routes>
                            </main>
                        </LocalizationProvider>
                    </NotificationProvider>
                </StyledSnackbarProvider>
            </CustomerProvider>
    );
}

export default App;
