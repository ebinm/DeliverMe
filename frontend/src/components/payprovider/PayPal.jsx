import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPal = ({ handlePaymentSuccess, handlePaymentError, createPayPalOrder }) => {

  const clientId = process.env.REACT_APP_CLIENT_ID;

  return (
    <PayPalScriptProvider options={{ 'client-id': clientId }}>
      <PayPalButtons
        createOrder={createPayPalOrder}
        onApprove={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </PayPalScriptProvider>
  );
};

export default PayPal;
