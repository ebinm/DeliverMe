import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import PaymentForm from './PaymentForm';

const theme = createTheme();

const containerStyle = {
  position: 'center',
  width: '845px',
  height: '858px',
  /* left: '297px',
  top: '35px', */
  background: '#FFFFFF',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  borderRadius: '10px',
};

const modalStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};


const lineStyle = {
  borderBottom: '1px solid #E2E8F0',
  width: '95%',
  margin: '10px',
};

const contentStyle = {
  margin: '40px',
  flex: 1,
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
  
  return (
    <Modal open={open} onClose={handleClose} style={modalStyle}>
      <div>
        <ThemeProvider theme={theme}>
          <Container >
            <Paper variant="outlined" sx={containerStyle}>
              <div>
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
              <PaymentForm contentStyle={contentStyle} />
            </Paper>
          </Container>
        </ThemeProvider>
      </div>
    </Modal>
  );
};

export default CheckoutPage;
