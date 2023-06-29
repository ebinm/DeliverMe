import React, {useState} from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export default function PayPal () {
  
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const [amount, setAmount] = useState('70');

  const handlePaymentSuccess = (data, actions) => {
    // Handle successful payment
    console.log('Payment successful:', data);
    return Promise.resolve(); //check this out!!
  };

  const handlePaymentError = (err) => {
    console.log(err);
  };
  const createPayPalOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: 70,// value: amount
          },
        },
      ],
    });
  };


  return (
    <PayPalScriptProvider options={{ 'client-id': clientId }}>
      <PayPalButtons
        createOrder={createPayPalOrder}
        onApprove={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </PayPalScriptProvider>
  );
}
