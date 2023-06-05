import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Grid from '@mui/material/Grid';

const PaymentForm = () => {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvc, setCVC] = useState('');

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCardNameChange = (event) => {
    setCardName(event.target.value);
  };

  const handleCardNumberChange = (event) => {
    setCardNumber(event.target.value);
  };

  const handleExpirationChange = (event) => {
    setExpiration(event.target.value);
  };

  const handleCVCChange = (event) => {
    setCVC(event.target.value);
  };

  const handlePayNow = () => {
    console.log('Processing payment with credit card');
  };

  const handlePaymentSuccess = (data, actions) => {
    console.log('Payment successful:', data);
    return Promise.resolve();
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
            value: '10.99',
          },
        },
      ],
    });
  };

  return (
    <Grid container mt={2} ml={2} mr={2} mb={2}>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Payment Method</FormLabel>
          <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
            <FormControlLabel value="credit_card" control={<Radio />} label="Credit Card" />
            {paymentMethod === 'credit_card' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Cardholder Name</Typography>
                  <TextField
                    label=""
                    variant="outlined"
                    value={cardName}
                    onChange={handleCardNameChange}
                    fullWidth
                    style={{ backgroundColor: '#EFF3EF' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Card Number</Typography>
                  <TextField
                    label=""
                    variant="outlined"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    fullWidth
                    style={{ backgroundColor: '#EFF3EF' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Expiration Date</Typography>
                  <TextField
                    label=""
                    variant="outlined"
                    value={expiration}
                    onChange={handleExpirationChange}
                    fullWidth
                    style={{ backgroundColor: '#EFF3EF' }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">CVC</Typography>
                  <TextField
                    label=""
                    variant="outlined"
                    value={cvc}
                    onChange={handleCVCChange}
                    fullWidth
                    style={{ backgroundColor: '#EFF3EF' }}
                  />
                </Grid>
              </Grid>
            )}
            <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
            {paymentMethod === 'paypal' && (
              <Grid item xs={12}>
                <PayPalScriptProvider options={{ 'client-id': clientId }}>
                  <PayPalButtons
                    createOrder={createPayPalOrder}
                    onApprove={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </PayPalScriptProvider>
              </Grid>
            )}
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default PaymentForm;
