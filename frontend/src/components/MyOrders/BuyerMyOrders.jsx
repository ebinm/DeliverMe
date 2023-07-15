import React from "react";
import {CircularProgress, Fab, Typography} from "@mui/material";
import {For, Show} from "../util/ControlFlow";
import {SingleOrderViewBuyer} from "./SingleOrderViewBuyer";
import {useFetch} from "../../util/hooks";
import {GuardCustomerType} from "../util/GuardCustomerType";
import AddIcon from '@mui/icons-material/Add';
import Stack from "@mui/material/Stack";
import {POST_FETCH_OPTIONS} from "../../util/util";
import {useSnackbar} from "notistack";

export function BuyerMyOrders() {
    const [orders, setOrders, loading] = useFetch(`${process.env.REACT_APP_BACKEND}/api/orders`, {credentials: 'include'})

    const {enqueueSnackbar} = useSnackbar()

    return <GuardCustomerType requiredType={"BUYER"} navigateOnInvalidType={"/shopper/my-orders"}>{() =>
        <Stack direction={"column"} sx={{"paddingBottom": "64px"}}>
            <Typography variant={"h4"} component={"h1"}>My Orders</Typography>

            <Show when={!loading} fallback={<CircularProgress sx={{color: "primary.dark"}}/>}>
                <For fallback={<Typography>You have not created any orders yet.</Typography>}
                     each={orders}>{(order, index) =>
                    <SingleOrderViewBuyer setOrders={setOrders} key={order._id} order={order}
                                          orderName={`Order ${index + 1}`}
                                          deleteSelf={async () => {
                                              const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${order._id}`, {
                                                  ...POST_FETCH_OPTIONS,
                                                  method: "DELETE"
                                              })

                                              if (res.ok) {
                                                  // We might also invalidate instead of filtering but
                                                  // this saves an additional fetch.
                                                  setOrders(orders => orders.filter(it => it._id !== order._id))
                                                  enqueueSnackbar("Order deleted successfully", {variant: "success"})
                                              } else {
                                                  enqueueSnackbar("Order could not be deleted", {variant: "error"})
                                              }
                                          }}
                    />
                }</For>
            </Show>

            <Fab sx={{
                "color": "white",
                "bgcolor": "primary.dark",
                "position": "fixed",
                "bottom": "32px",
                "right": "32px",
            }} aria-label="add" href={"/buyer/order/create"}>
                <AddIcon/>
            </Fab>
        </Stack>
    }</GuardCustomerType>
}
