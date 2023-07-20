import React from "react";
import {CircularProgress, Typography} from "@mui/material";
import {For, Show} from "../util/ControlFlow";
import {SingleOrderViewShopper} from "./SingleOrderViewShopper";
import {GuardCustomerType} from "../util/GuardCustomerType";
import {useFetch} from "../../util/hooks";


export function ShopperMyOrders() {
    const [orders, setOrders, loading] = useFetch(`${process.env.REACT_APP_BACKEND}/api/orders`, {credentials: 'include'})


    return <GuardCustomerType requiredType={"SHOPPER"} navigateOnInvalidType={"/buyer/my-orders"}>{() =>
        <>
            <Typography variant={"h4"} component={"h1"}>My Orders</Typography>

            <Show when={!loading} fallback={<CircularProgress sx={{color: "primary.dark"}}/>}>
                <For fallback={<Typography>None of your bids have been accepted yet.</Typography>}
                     each={orders}>{(order, index) =>
                    <SingleOrderViewShopper key={order._id} order={order} orderName={`Order ${index}`}
                                            setOrders={setOrders}/>
                }</For>
            </Show>
        </>
    }</GuardCustomerType>


}
