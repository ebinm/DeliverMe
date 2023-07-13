import React, {useEffect, useState} from 'react';
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";
import {useSnackbar} from "notistack";
import {loadScript} from "@paypal/paypal-js";
import {useNavigate, useParams} from "react-router-dom";
import {useFetch} from "../../util/hooks";
import {POST_FETCH_OPTIONS} from "../../util/util";

export default function PayPal() {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate()
    const params = useParams();
    const [paypalReady, setPaypalReady] = useState(false);
    const [order, ] = useFetch(`${process.env.REACT_APP_BACKEND}/api/orders/${params.id}`, {credentials: 'include'})

    useEffect(() => {
        loadScript({"client-id": process.env.CLIENT_ID})
            .then(() => {
                setPaypalReady(true);
            })
            .catch((err) => {
                console.error("failed to load the PayPal JS SDK script", err);
            });
    }, []);


    if (!paypalReady) {
        return null; // or render a loading spinner
    }

    return (<PayPalScriptProvider options={{
        "client-id": process.env.CLIENT_ID
    }}>
        {order && order?.selectedBid && (<PayPalButtons
            createOrder={() => {
                return fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${params.id}/checkout`, {
                    ...POST_FETCH_OPTIONS
                }).then(res => res.json())
                    .then(res => {
                        console.log("res", res)
                        return res.transactionId
                    })
            }}

            onApprove={(data) => { // Pass 'data' and 'actions' parameters
                return fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${params.id}/capture`, {
                    ...POST_FETCH_OPTIONS, body: JSON.stringify({transactionId: data.orderID})
                })
                    .then(res => res.json())
                    .catch(details => {
                        // TODO error handling
                        console.log("Capture Error", details)
                        enqueueSnackbar("Payment could not be completed", {variant: "error"})
                    })
                    .then(details => {
                        console.log("Capture Result", details)
                        console.log(details)
                        enqueueSnackbar("Purchase completed", {variant: "success"});
                        navigate("/buyer/my-orders")
                        return details
                    })
            }}

            onError={(err) => {
                console.error('PayPal error:', err);
                enqueueSnackbar("Transaction failed.", {variant: "error"});
            }}
        />)}
    </PayPalScriptProvider>);
}
