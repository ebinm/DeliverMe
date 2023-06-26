import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import {BaseModal} from '../util/BaseModal';
import {DarkButton, OutlinedButton} from "../util/Buttons";
import PaymentForm from './PaymentForm';

const lineStyle = {
  borderBottom: '1px solid #E2E8F0',
  width: '95%',
  margin: '10px',
};

const contentStyle = {
  margin: '20px',
  flex: 1,
};

const paymentDetailsStyle = {
  margin: '20px',
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px',
};

const CheckoutPage = () => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    // Handle cancel order
    console.log('Order canceled');
    handleClose(); // Close the popup window
  };

  const handleConfirm = () => {
    // Handle confirm order
    console.log('Order confirmed');
    handleClose();
  };

  return (
    <BaseModal open={open} onClose={handleClose} >
      <div>
              <div className="payment-details" style={paymentDetailsStyle}>
                <Typography component="h1" variant="h5" align="left">
                  Payment Details
                </Typography>
              </div>
              <div style={lineStyle} />
              <div style={contentStyle}>
                <div style={rowStyle}>
                  <Typography variant="body1">Delivery Costs (with fee)</Typography>
                  <Typography variant="body1">20 euro</Typography>
                </div>
                <div style={rowStyle}>
                  <Typography variant="body1">Grocery Bill</Typography>
                  <Typography variant="body1">50 euro</Typography>
                </div>
                <div style={rowStyle}>
                  <Typography variant="body1">Total</Typography>
                  <Typography variant="body1">70 euro</Typography>
                </div>
              </div>
              <div style={lineStyle} />
              <PaymentForm  />
              <div style={lineStyle} />
              
              <Stack direction={"row-reverse"} gap={"16px"}>
              <DarkButton  variant={"text"} onClick={handleConfirm}>Add
                    Item</DarkButton>
              <OutlinedButton onClick={handleCancel}>Go Back</OutlinedButton>
              </Stack>
  
      </div>
    </BaseModal>
  );
};

export default CheckoutPage;
