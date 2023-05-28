import {Navigate} from "react-router-dom";
import React, {useContext, useState} from "react";
import {CustomerContext} from "../../util/context/CustomerContext";
import {Box, CircularProgress, Typography} from "@mui/material";
import {For} from "../util/ControlFlow";
import {SingleOrderViewBuyer} from "./SingleOrderViewBuyer";
import {mockedOrders} from "../../util/mockdata";


export function BuyerMyOrders(){
    const {customer, ready} = useContext(CustomerContext)
    const [orders ] = useState(mockedOrders)

    if (!ready){
        return <CircularProgress/>
    }

    if(!customer){
        return <Navigate to={"/login"}/>
    }

    if(customer.type !== "BUYER"){
        // TODO correct location
        return <Navigate to={"/shopper/my-orders"}/>
    }


    return <Box sx={{
        "backgroundColor": "main.light",
        "padding": "32px"
    }}>
        <Typography variant={"h4"} component={"h1"}>My Orders</Typography>

        <For each={orders}>{(order, index) =>
            <SingleOrderViewBuyer key={order._id} order={order} index={index}/>
        }</For>


    </Box>


}
