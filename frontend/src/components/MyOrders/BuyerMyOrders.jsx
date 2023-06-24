import {createSearchParams, Navigate, useLocation} from "react-router-dom";
import React, {useContext} from "react";
import {CustomerContext} from "../../util/context/CustomerContext";
import {CircularProgress, Typography} from "@mui/material";
import {For, Show} from "../util/ControlFlow";
import {SingleOrderViewBuyer} from "./SingleOrderViewBuyer";
import {useFetch} from "../../util/hooks";


export function BuyerMyOrders() {
    const {customer, ready} = useContext(CustomerContext)

    const [orders, , loading] = useFetch(`${process.env.REACT_APP_BACKEND}/api/orders`, {credentials: 'include'})


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

    if (customer.type !== "BUYER") {
        return <Navigate to={"/shopper/my-orders"}/>
    }


    return <>
        <Typography variant={"h4"} component={"h1"}>My Orders</Typography>

        <Show when={loading}>
            <CircularProgress/>
        </Show>
        <For each={orders}>{(order, index) =>
            <SingleOrderViewBuyer key={order._id} order={order} orderName={`Order ${index}`}/>
        }</For>
    </>
}
