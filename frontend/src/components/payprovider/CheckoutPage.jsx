import React, {useState} from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import PaymentForm from './PaymentForm';

const theme = createTheme();

const containerStyle = {
  position: 'center',
  width: '845px',
  height: '860px',
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

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end', // Align buttons to the right
    marginTop: '20px', // Add some margin for spacing
    marginRight: '60px',
  };

  const confirmButtonStyle = {
    height: '59.71940612792969px',
    width: '200px',
    background: '#AAC0AA',
    borderRadius: '10px',
    marginLeft: '10px', // Add some spacing between buttons
  };
  
  const cancelButtonStyle = {
    height: '59.71940612792969px',
    width: '200px',
    background: 'white',
    color: '#4A5568',
    borderRadius: '10px',
  };
  
  return (
    <Modal open={open} onClose={handleClose} style={modalStyle}>
      <div>
        <ThemeProvider theme={theme}>
          <Container>
            <Paper variant="outlined" sx={containerStyle}>
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
              <div style={buttonContainerStyle}>
  <Button sx={cancelButtonStyle} variant="contained" onClick={handleCancel}>
    Cancel
  </Button>
  <Button sx={confirmButtonStyle} variant="contained" color="primary" onClick={handleConfirm}>
    Confirm Order
  </Button>
</div>
            </Paper>
          </Container>
        </ThemeProvider>
      </div>
    </Modal>
  );
};

export default CheckoutPage;
