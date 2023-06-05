import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Box, TextField } from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { FaCcMastercard, FaCcVisa, FaPaypal } from 'react-icons/fa';
import { styled } from '@mui/system';

const IconContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const Icon = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

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
  const textFieldStyle = {
    backgroundColor: '#EFF3EF',
  };

  return (
    <Box mt={4} ml={4} mr={4} mb={4} display="flex" flexDirection="column" alignItems="stretch">
      <FormControl component="fieldset">
        <FormLabel component="legend">Payment Method</FormLabel>
        <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
          <FormControlLabel
            value="credit_card"
            control={<Radio />}
            label={
              <Box display="flex" alignItems="center">
                <Typography variant="body1">Credit Card</Typography>
                <IconContainer>
                  <Icon>
                    <FaCcMastercard size={20} />
                  </Icon>
                  <Icon>
                    <FaCcVisa size={20} />
                  </Icon>
                </IconContainer>
              </Box>
            }
          />
          {paymentMethod === 'credit_card' && (
            <Box display="flex" flexDirection="column" alignItems="stretch">
              <Box>
                <Typography variant="subtitle1">Cardholder Name</Typography>
                <TextField
                  label=""
                  variant="outlined"
                  value={cardName}
                  onChange={handleCardNameChange}
                  fullWidth
                  margin="normal"
                  style={textFieldStyle}
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
            </Box>
          )}
          <FormControlLabel
            value="paypal"
            control={<Radio />}
            label={
              <Box display="flex" alignItems="center">
                <Typography variant="body1">PayPal</Typography>
                <IconContainer>
                  <Icon>
                    <FaPaypal size={20} />
                  </Icon>
                </IconContainer>
              </Box>
            }
          />
          {paymentMethod === 'paypal' && (
            <Box flex={1} display="flex" justifyContent="center" alignItems="center" marginTop={2}>
              <PayPalScriptProvider options={{ 'client-id': clientId }}>
                <PayPalButtons
                  createOrder={createPayPalOrder}
                  onApprove={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </PayPalScriptProvider>
            </Box>
          )}
        </RadioGroup>
      </FormControl>
    </Box>
    
  );
};

export default PaymentForm;
