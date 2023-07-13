import React, {useContext, useEffect, useState} from 'react';
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";
import {useSnackbar} from "notistack";
import {loadScript} from "@paypal/paypal-js";
import {CustomerContext} from "../../util/context/CustomerContext";
import {useNavigate, useParams} from "react-router-dom";
import {useFetch} from "../../util/hooks";
import {POST_FETCH_OPTIONS} from "../../util/util";

export default function PayPal({onTransactionComplete}) {
    const {enqueueSnackbar} = useSnackbar();
    const params = useParams();
    const navigate = useNavigate();
    const {customer} = useContext(CustomerContext);


    const [paypalReady, setPaypalReady] = useState(false);
    const [orders,] = useFetch(`${process.env.REACT_APP_BACKEND}/api/orders/${params.id}`, {credentials: 'include'})

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

    return (
        <PayPalScriptProvider options={{
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

                onApprove={(data) => {
                    return fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${params.id}/capture`, {
                        ...POST_FETCH_OPTIONS, body: JSON.stringify({transactionId: data.orderID})
                    })
                        .then(res => res.json())
                        .then(details => {
                            console.log("Capture Result", details)
                            console.log(details)
                            const transaction = orderData.purchase_units[0].payments.captures[0];
                            if (transaction.status === 'COMPLETED') {
                                onTransactionComplete(); // Call the callback function to notify transaction completion
                                navigate("/buyer/my-orders")
                            }
                            enqueueSnackbar("Transaction status: " + transaction.status, {variant: "success"}); // transaction.status && transaction.id
                            return details
                        })
                        .catch(details => {
                            // TODO error handling
                            console.log("Capture Error", details)
                            enqueueSnackbar("Payment could not be completed", {variant: "error"})
                        })
                }}

                onError={(err) => {
                    console.error('PayPal error:', err);
                    enqueueSnackbar("Transaction failed.", {variant: "error"});
                }}
            />)}
        </PayPalScriptProvider>
    );
}
