import React, { useState, useContext } from 'react';
import { Box, Container, Typography } from '@mui/material';
import PaymentForm from './PaymentForm';
import {DarkButton, OutlinedButton} from "../util/Buttons";
import {useSnackbar} from "notistack";
import {useFetch} from "../../util/hooks";
import {CustomerContext} from "../../util/context/CustomerContext";
import {useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom"; 
import { BaseModal } from '../util/BaseModal';




export  function CheckoutPage() {
  const [open, setOpen] = useState(true);
  const params = useParams();

  const [orders, setOrder] =  useFetch(`${process.env.REACT_APP_BACKEND}/api/orders/${params.id}`, {credentials: 'include'})
  console.log(orders);
  

  const navigate = useNavigate();

  const {enqueueSnackbar} = useSnackbar();

  const {customer} = useContext(CustomerContext);



  const lineStyle = {
    borderBottom: '1px solid #E2E8F0',
    width: '98%',
    margin: '10px',
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
};

  const handleCancel = () => {
    navigate(`/${customer.type.toLowerCase()}/my-orders`);
    console.log('Order cancelled');
    handleClose(); 
    return enqueueSnackbar("Payment cancelled", {variant: "warning"});
  };

  
  
  
    return <BaseModal
                open={open} >
      <Box>
          <Container>
              <Box >
                <Typography component="h1" variant="h5" align="left">
                  Payment Details
                </Typography>
              </Box>
              <div style={lineStyle} />
              
              <Box>
              {orders && orders?.selectedBid &&(
                <div style={rowStyle}>
                  {/*  total-bill?? */}
                  <Typography variant="body1">Delivery Costs (with fee)</Typography>
                  <Typography variant="body1">{orders?.selectedBid?.moneyBid.amount} {orders?.selectedBid?.moneyBid.currency}</Typography>
                </div>
              )}

                {orders && orders.groceryBill && (
                <div style={rowStyle}>
                  <Typography variant="body1">Grocery Bill</Typography>
                  <Typography variant="body1">{orders.groceryBill.costAmount}  {orders.groceryBill.costCurrency}</Typography>
                </div>
                )}
                {orders && orders?.selectedBid &&(
                <div style={rowStyle}>
                  <Typography variant="body1">Total</Typography>
                  <Typography variant="body1">{orders?.selectedBid?.moneyBidWithFee.amount}  {orders?.selectedBid?.moneyBidWithFee.currency}</Typography>
                </div>
                )}
              </Box>
              
              
              <div style={lineStyle} />
              <PaymentForm/>
              <div style={lineStyle} />
              <Box display="flex" flexDirection="row">
                 <OutlinedButton onClick={handleCancel}>Cancel</OutlinedButton>
                 <DarkButton onClick={handleConfirm}>Confirm</DarkButton>
              </Box>
          </Container>
      </Box>
    </BaseModal>
    
  
}
