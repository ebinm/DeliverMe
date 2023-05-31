import React from "react";
import Header from "./components/Header";
import CheckoutForm from "./components/payment/Checkout";
import Checkout from "./components/payment/Checkoutmui";
import {Route, Routes} from "react-router-dom";
import { Box } from "@mui/material";
import PaymentForm from "./components/payprovider/PaymentProvider";
import CreditCardForm from "./components/payprovider/CreditCard";
function App() {
  return (
    <main>
      <Header/>
      <Box sx={{ m: 10, maxHeight: "10%" }}>
        <Routes>
            <Route path={"/"} element={"Hi, I am home"}/>
            <Route path={"/login"} element={"Hi, I am login"}/>
            <Route path={"/personal-shopper/signup"} element={"Hi, I am Personal Shopper Sign-in"}/>
            <Route path={"/trial"} element={<CheckoutForm/>} />
9           <Route path={"/checkout"} element={<Checkout/>} />
            <Route path={"/paytest"} element={<CreditCardForm/>}/>
        </Routes>
      </Box>
    </main>
  );
}

export default App;
