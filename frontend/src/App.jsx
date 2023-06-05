import React from "react";
import Header from "./components/Header";
import CheckoutForm from "./components/payprovider/CheckoutPage";
import {Route, Routes} from "react-router-dom";
import { Box } from "@mui/material";
import './App.css';

function App() {
  return (
    <main className="App">
      <Header/>
      <Box sx={{ m: 10, maxHeight: "10%" }}>
        <Routes>
            <Route path={"/"} element={"Hi, I am home"}/>
            <Route path={"/login"} element={"Hi, I am login"}/>
            <Route path={"/personal-shopper/signup"} element={"Hi, I am Personal Shopper Sign-in"}/>
            <Route path={"/checkout"} element={<CheckoutForm/>} />
        </Routes>
      </Box>
    </main>
  );
}

export default App;
