import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSnackbar } from "notistack";
import { loadScript } from "@paypal/paypal-js";
import { useParams } from "react-router-dom"; 
import {useFetch} from "../../util/hooks";
import { PUT_FETCH_OPTIONS } from "../../util/util";

export default function PayPal() {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const [paypalReady, setPaypalReady] = useState(false);
  const [orders, setOrder] =  useFetch(`${process.env.REACT_APP_BACKEND}/api/orders/${params.id}`, {credentials: 'include'})
  console.log(orders);

  useEffect(() => {
    loadScript({ "client-id": process.env.CLIENT_ID })
      .then((paypal) => {
        setPaypalReady(true);
      })
      .catch((err) => {
        console.error("failed to load the PayPal JS SDK script", err);
      });
  }, []);

  const handleStatusChange = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${params.id}/changeStatus`, {
      ...PUT_FETCH_OPTIONS,
      body: JSON.stringify({
        bidId: orders.selectedBid,
        status: "Finished"
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Status change successful:', data);
      })
      .catch((error) => {
        console.error('Status change failed:', error);
        // Handle any error cases
      });
  };

  if (!paypalReady) {
    return null; // or render a loading spinner
  }
  console.log('Id:', params.id);

  return (
    <PayPalScriptProvider options={{
      "client-id": process.env.CLIENT_ID
    }}>
    {orders && orders?.selectedBid && (
      <PayPalButtons
        createOrder={(data, actions, err) => {
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  value: orders?.selectedBid?.moneyBidWithFee.amount
                },
                payment_instruction: {
                  platform_fees: [
                    {
                      amount: {
                        currency_code: 'EUR',
                        value: orders?.selectedBid?.moneyBidWithFee.amount
                      },
                      payee: {
                        email_address: 'anxhela.maloku@tum.de'
                      }
                    }
                  ]
                }
              }
            ]
          });
        }}

        onApprove={async (data, actions) => { // Pass 'data' and 'actions' parameters
          return actions.order.capture()
            .then((orderData) => {
              console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
              const transaction = orderData.purchase_units[0].payments.captures[0];
              enqueueSnackbar("Transaction ${transaction.status}: ${transaction.id}", { variant: "success"});
              handleStatusChange();
            })
            .catch((err) => {
              console.error('Capture error:', err);
              enqueueSnackbar("Transaction failed.", { variant: "error" });
            });
        }}

        onError={(err) => {
          console.error('PayPal error:', err);
          enqueueSnackbar("Transaction failed.", { variant: "error" });
        }}
      />
    )}
    </PayPalScriptProvider>
  );
}
