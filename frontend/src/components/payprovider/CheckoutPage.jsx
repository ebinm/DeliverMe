import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import { BaseModal } from '../util/BaseModal';
import { DarkButton, OutlinedButton } from "../util/Buttons";
import PaymentForm from './PaymentForm';
import { Grid } from '@mui/material';

const lineStyle = {
  borderBottom: '1px solid #E2E8F0',
  width: '90%',
  margin: '10px',
};

const contentStyle = {
  margin: '20px',
  flex: 1,
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px',
};

export default function CheckoutPage() {
  const [open, setOpen] = useState(true);
  const [order, setOrder] = useState({ status: 'Payment' });

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    // Handle cancel order 
    console.log('Order canceled');
    handleClose(); // Close the popup window
  };

  const handleConfirm = () => {
    const updatedOrder = { ...order, status: "Finished" };
    console.log('Order confirmed');
    setOrder(updatedOrder);
    handleClose();
  };

  return (
    <>
      <BaseModal open={open} onClose={handleClose}>
        <Grid>
          <Grid className="payment-details" margin="20px">
            <Typography component="h1" variant="h5" align="left">
              Payment Details
            </Typography>
          </Grid>
          <div style={lineStyle} />
          <Grid style={contentStyle}>
            <Grid style={rowStyle}>
              <Typography variant="body1">Delivery Costs (with fee)</Typography>
              <Typography variant="body1">20 euro</Typography>
            </Grid>
            <Grid style={rowStyle}>
              <Typography variant="body1">Grocery Bill</Typography>
              <Typography variant="body1">50 euro</Typography>
            </Grid>
            <Grid style={rowStyle}>
              <Typography variant="body1">Total</Typography>
              <Typography variant="body1">70 euro</Typography>
            </Grid>
          </Grid>
          <div style={lineStyle} />
          <Grid>
            <PaymentForm />
          </Grid>
          <div style={lineStyle} />

          {order.status === 'Payment' && (
            <Stack direction="row-reverse" spacing={2}>
              <DarkButton variant="text" onClick={handleConfirm}>
                Done
              </DarkButton>
              <OutlinedButton onClick={handleCancel}>Cancel</OutlinedButton>
            </Stack>
          )}

        </Grid>
      </BaseModal>
    </>
  );
}
