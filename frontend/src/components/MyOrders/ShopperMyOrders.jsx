import {createSearchParams, Navigate, useLocation} from "react-router-dom";
import React, {useContext, useState} from "react";
import {CustomerContext} from "../../util/context/CustomerContext";
import {Box, CircularProgress, Typography} from "@mui/material";
import {For} from "../util/ControlFlow";
import {mockedOrders} from "../../util/mockdata";
import {SingleOrderViewShopper} from "./SingleOrderViewShopper";


export function ShopperMyOrders() {
    const {customer, ready} = useContext(CustomerContext)
    const [orders] = useState(mockedOrders.filter(o => o.selectedBid))
    const location = useLocation()

    if (!ready) {
        return <CircularProgress/>
    }

    if (!customer) {
        return <Navigate to={{
            pathname: "/login",
            search: createSearchParams({
                "ref": location.pathname
            }).toString()
        }}/>
    }

    if (customer.type !== "SHOPPER") {
        return <Navigate to={"/buyer/my-orders"}/>
    }


    return <Box sx={{
        "backgroundColor": "main.light",
        "padding": "32px"
    }}>
        <Typography variant={"h4"} component={"h1"}>My Orders</Typography>

        <For each={orders}>{(order, index) =>
            <SingleOrderViewShopper key={order._id} order={order} index={index}/>
        }</For>


    </Box>


}
