import {NavLink} from "react-router-dom";
import React from "react";
import {CircularProgress, Typography} from "@mui/material";
import {For, Show} from "../util/ControlFlow";
import {SingleOrderViewBuyer} from "./SingleOrderViewBuyer";
import {useFetch} from "../../util/hooks";
import {GuardCustomerType} from "../util/GuardCustomerType";


export function BuyerMyOrders() {
    const [orders, setOrders, loading] = useFetch(`${process.env.REACT_APP_BACKEND}/api/orders`, {credentials: 'include'})


    return <GuardCustomerType requiredType={"BUYER"} navigateOnInvalidType={"/shopper/my-orders"}>

        <Typography variant={"h4"} component={"h1"}>
            My Orders&nbsp;
            <NavLink to={"/buyer/order/create"}>[Create new]</NavLink>
        </Typography>

        <Show when={loading}>
            <CircularProgress/>
        </Show>
        <For fallback={<Typography>You have not created any orders yet.</Typography>} each={orders}>{(order, index) =>
            <SingleOrderViewBuyer setOrders={setOrders} key={order._id} order={order} orderName={`Order ${index}`}/>
        }</For>
    </GuardCustomerType>
}
