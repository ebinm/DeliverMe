import React, { useEffect, useState, useContext } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSnackbar } from "notistack";
import { loadScript } from "@paypal/paypal-js";
import {CustomerContext} from "../../util/context/CustomerContext";
import { useParams, useNavigate } from "react-router-dom"; 
import {useFetch} from "../../util/hooks";
import { PUT_FETCH_OPTIONS } from "../../util/util";

export default function PayPal({ onTransactionComplete }) {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const navigate = useNavigate();
  const {customer} = useContext(CustomerContext);


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
    {orders && orders?.selectedBid && orders.groceryBill && (
      <PayPalButtons
        createOrder={(data, actions, err) => {
          const totalAmount = (orders.groceryBill.costAmount + orders?.selectedBid?.moneyBidWithFee.amount).toFixed(2);
          //const shopperAmount = orders?.selectedBid?.moneyBid.amount.toFixed(2);
          //const fee = (orders?.selectedBid?.moneyBidWithFee.amount - orders?.selectedBid?.moneyBid.amount).toFixed(2);

          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
    {
      reference_id: "REFID-1",
      amount: {
        currency_code: "EUR",
        value: totalAmount
      },
      payment_instruction: {
        disbursement_mode: "INSTANT",
        platform_fees: [
          {
            amount: {
              currency_code: "EUR",
              value: totalAmount
            },
            payee: {
              email_address: "anxhela.maloku@tum.de" // Replace with a valid PayPal sandbox email for the first recipient
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
              handleStatusChange();
              if (transaction.status === 'COMPLETED') {
                onTransactionComplete(); // Call the callback function to notify transaction completion
                navigate(`/${customer.type.toLowerCase()}/my-orders`);
              }
              enqueueSnackbar("Transaction status: " + transaction.status, { variant: "success"}); // transaction.status && transaction.id
              

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
