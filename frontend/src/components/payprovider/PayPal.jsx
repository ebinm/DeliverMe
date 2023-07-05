import React, {useState} from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function PayPal () {
  
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const [amount, setAmount] = useState('70.00');
  
// Order is created on the server and the order id is returned
  function createPayPalOrder () {
    return fetch("/api/create-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body param is used to pass the order information
      //TODO: link to mongo DB 
      body: JSON.stringify({
        cart: [
          {
            amount: {
              value: {amount}
            }
          },
        ],
      }),
    })
    .then((response) => response.json())
    .then((order) => order.id);
  };

  function handlePaymentSuccess (data) {
    return fetch("/api/capture-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID: data.orderID
      })
    })
    .then((response) => response.json())
    .then((orderData) => {
      // Successful capture! 
      console.log('Bill Payment Details', orderData, JSON.stringify(orderData, null, 2));
      const transaction = orderData.purchase_units[0].payments.captures[0];
      alert(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
      //  remove the alert and show a success message within this page. For example:
      // const element = document.getElementById('paypal-button-container');
      // element.innerHTML = '<h3>Thank you for your payment!</h3>';
      // Or go to another URL:  window.location.href = 'thank_you.html';
    });
  };

  const handlePaymentError = (err) => {
    console.log(err);
  };

  return (
    <PayPalScriptProvider options={{ 
      'client-id': clientId ,
      currency: "USD",
    }}>
      <PayPalButtons
        createOrder={createPayPalOrder}
        onApprove={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </PayPalScriptProvider>
  );
}

