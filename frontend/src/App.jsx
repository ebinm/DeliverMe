import React from "react";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import MapWithList from "./components/BuyerChooseShop/BuyerChooseShopView";
import { Box } from "@mui/material";
import TestExample from "./components/BuyerChooseShop/TestExample";


function App() {
  return (
    <main>
      <Header />
      <Box sx={{ m: 10, maxHeight: "10%" }}>
        <Routes >
          <Route path={"/"} element={"Hi, I am home"} />
          <Route path={"/login"} element={"Hi, I am login"} />
          <Route path={"/map"} element={<MapWithList />} />
          <Route path={"/test"} element={<TestExample />} />
          <Route path={"/personal-shopper/signup"} element={"Hi, I am Personal Shopper Sign-in"} />
        </Routes>
      </Box>
    </main>
  );
}

export default App;
