import React, { useState, useContext } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import PaymentForm from './PaymentForm';
import {DarkButton, OutlinedButton} from "../util/Buttons";
import {useSnackbar} from "notistack";
import {PUT_FETCH_OPTIONS} from "../../util/util";
import {CustomerContext} from "../../util/context/CustomerContext";
import {useNavigate } from "react-router-dom";


export function CheckoutPage({order, setOrders, onSuccess}) {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState(undefined);
  const [uploadLoading, setUploadLoading] = useState(false)
  const navigate = useNavigate();

  const {enqueueSnackbar} = useSnackbar();

  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("EUR");
  const {customer} = useContext(CustomerContext);

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

const handleClose = () => {
  setOpen(false);
};

const handleConfirm = async () => {
  console.log('Order confirmed');
  handleClose();
  navigate(`/${customer.type.toLowerCase()}/my-orders`);

  if (order && typeof order === 'object') {
    const updatedOrder = { ...order, status: "Finished" }; // Create a new object with updated status
    
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${order.id}/receipt`, {
        ...PUT_FETCH_OPTIONS,
        body: JSON.stringify({
          costAmount: amount,
          costCurrency: currency
        })
      });

      if (res.ok) {
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((o) => (o.id === order.id ? updatedOrder : o));
          return updatedOrders 
        });
        onSuccess();
      } else {
        setError(JSON.stringify((await res.json()).msg));
      }
    } catch (error) {
      setError(error.message);
    }
  } else {
    setError("Invalid order");
  }

  setUploadLoading(false);
  return enqueueSnackbar("Payment done", {variant: "success"});
};

  const handleCancel = () => {
    navigate(`/${customer.type.toLowerCase()}/my-orders`);
    console.log('Order canceled');
    handleClose(); 
    return enqueueSnackbar("Payment cancelled", {variant: "warning"});
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end', // Align buttons to the right
    marginTop: '20px', // Add some margin for spacing
    marginRight: '60px',
  };
  
  const cancelButtonStyle = {
    height: '59.71940612792969px',
    width: '200px',
    background: 'white',
    color: '#4A5568',
    borderRadius: '10px',
  };
  
  
    return <Modal
                open={open} 
                style={modalStyle}>
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
              <PaymentForm/>
              <div style={lineStyle} />
              <div style={buttonContainerStyle}>
  <Button sx={cancelButtonStyle} variant="contained" onClick={handleCancel}>
    Cancel
  </Button>
  <DarkButton onClick={handleConfirm}>
    Confirm
  </DarkButton>

</div>
            </Paper>
          </Container>
        </ThemeProvider>
      </div>
    </Modal>
    
  
}
