import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Box, TextField } from '@mui/material';
import { FaCcMastercard, FaCcVisa, FaPaypal } from 'react-icons/fa';
import { styled } from '@mui/system';
import PayPal from './PayPal';
import CreditCard from './CreditCard';
import {loadStripe} from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const IconContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const Icon = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

export default function PaymentForm () {
  
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  
  const PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
  const stripeTestPromise = loadStripe(PUBLIC_KEY);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
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
            <Elements stripe={stripeTestPromise} >
               <CreditCard/>
            </Elements>

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
              <PayPal/>
            </Box>
          )}
        </RadioGroup>
      </FormControl>
    </Box>
    
  );
}

