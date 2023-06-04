import {CircularProgress, Paper} from "@mui/material";
import {OrderItemsOverview} from "../../MyOrders/OrderItemsOverview";
import {createSearchParams, Navigate, useLocation} from "react-router-dom";
import React, {useContext} from "react";
import {CustomerContext} from "../../../util/context/CustomerContext";

export function BuyerOrderSummary({
                                      items,
                                      to, from, notes,
                                      shop
                                  }) {

    const {customer, ready} = useContext(CustomerContext)
    const location = useLocation()


    if(!ready){
        return <CircularProgress/>
    }

    if (!customer) {
        return <Navigate to={{
            pathname: "/buyer/signup",
            search: createSearchParams({
                "ref": location.pathname
            }).toString()
        }}/>
    }

    return <Paper>

        <OrderItemsOverview items={items} defaultExpanded={true}/>



    </Paper>


}