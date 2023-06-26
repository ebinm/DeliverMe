import React, { useState } from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Box, Modal } from '@mui/material';
import Typography from '@mui/material/Typography';
import { FaCcMastercard, FaCcVisa, FaPaypal } from 'react-icons/fa';
import PayPal from './PayPal';
import CreditCard from './CreditCard';
import {BaseModal} from "../util/BaseModal"

const PaymentModal = ({ open, onClose }) => {
  
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

  const handlePaymentSuccess = (data, actions) => {
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
            value: '70',
          },
        },
      ],
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
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
                  <Box display="flex" alignItems="center">
                    <div>
                      <FaCcMastercard size={20} />
                    </div>
                    <div>
                      <FaCcVisa size={20} />
                    </div>
                  </Box>
                </Box>
              }
            />
            {paymentMethod === 'credit_card' && (
              <CreditCard
                cardName={cardName}
                cardNumber={cardNumber}
                expiration={expiration}
                cvc={cvc}
                handleCardNameChange={handleCardNameChange}
                handleCardNumberChange={handleCardNumberChange}
                handleExpirationChange={handleExpirationChange}
                handleCVCChange={handleCVCChange}
              />
            )}
            <FormControlLabel
              value="paypal"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center">
                  <Typography variant="body1">PayPal</Typography>
                  <div>
                    <FaPaypal size={20} />
                  </div>
                </Box>
              }
            />
            {paymentMethod === 'paypal' && (
              <PayPal
               
                handlePaymentSuccess={handlePaymentSuccess}
                handlePaymentError={handlePaymentError}
                createPayPalOrder={createPayPalOrder}
              />
            )}
          </RadioGroup>
        </FormControl>
      </Box>
    </Modal>
  );
};

export default PaymentModal;
