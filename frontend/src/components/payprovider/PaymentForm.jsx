import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { FormControlLabel, Radio, RadioGroup, TextField, Button, Box } from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PaymentForm = () => {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvc, setCVC] = useState('');

  const [amount, setAmount] = useState('70');

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
    // Handle payment with credit card
    console.log('Processing payment with credit card:', amount);
  };
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
            value: '10.99',
          },
        },
      ],
    });
  };
  
  return (
    <div>
      <FormControl component="fieldset">
        <FormLabel component="legend">Payment Method</FormLabel>
        <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
          <FormControlLabel value="credit_card" control={<Radio />} label="Credit Card" />
          {paymentMethod === 'credit_card' && (
            <div>
              <Box>
                <Typography variant="subtitle1">Cardholder Name</Typography>
                <TextField
                  label=""
                  variant="outlined"
                  value={cardName}
                  onChange={handleCardNameChange}
                  fullWidth
                  margin="normal"
                  style={{ backgroundColor: '#EFF3EF' }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle1">Card Number</Typography>
                <TextField
                  label=""
                  variant="outlined"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  fullWidth
                  margin="normal"
                  style={{ backgroundColor: '#EFF3EF' }}
                />
              </Box>
              <Box display="flex" flexDirection="row">
                <Box flex={1}>
                  <Typography variant="subtitle1">Expiration Date</Typography>
                  <TextField
                    label=""
                    variant="outlined"
                    value={expiration}
                    onChange={handleExpirationChange}
                    fullWidth
                    margin="normal"
                    style={{ backgroundColor: '#EFF3EF' }}
                  />
                </Box>
                <Box flex={1} marginLeft={2}>
                  <Typography variant="subtitle1">CVC</Typography>
                  <TextField
                    label=""
                    variant="outlined"
                    value={cvc}
                    onChange={handleCVCChange}
                    fullWidth
                    margin="normal"
                    style={{ backgroundColor: '#EFF3EF' }}
                  />
                </Box>
              </Box>
              
            </div>
          )}
          <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
          {paymentMethod === 'paypal' && (
            <PayPalScriptProvider options={{ 'client-id': clientId }}>
              <PayPalButtons
                createOrder={createPayPalOrder}
                onApprove={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </PayPalScriptProvider>
          )}
        </RadioGroup>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handlePayNow}>
                Pay Now
              </Button>
    </div>
    
  );
};

export default PaymentForm;
