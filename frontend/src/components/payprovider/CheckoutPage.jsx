import React, { useState, useContext } from 'react';
import { Box, Container, Typography, FormControlLabel } from '@mui/material';
import { styled } from '@mui/system';
import { FaPaypal } from 'react-icons/fa';
import {DarkButton, OutlinedButton} from "../util/Buttons";
import {useSnackbar} from "notistack";
import {useFetch} from "../../util/hooks";
import {CustomerContext} from "../../util/context/CustomerContext";
import {useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom"; 
import { BaseModal } from '../util/BaseModal';
import PayPal from './PayPal';



export  function CheckoutPage() {
  const [open, setOpen] = useState(true);
  const [isTransactionCompleted, setTransactionCompleted] = useState(false);

  const handleTransactionComplete = () => {
    setTransactionCompleted(true);
  };


  const params = useParams();

  const [orders, setOrder] =  useFetch(`${process.env.REACT_APP_BACKEND}/api/orders/${params.id}`, {credentials: 'include'})
  console.log(orders);
  //const totalAmount = (orders?.selectedBid?.moneyBidWithFee.amount.toFixed(2) + orders.groceryBill.costAmount.toFixed(2));
  
  
  const navigate = useNavigate();

  const {enqueueSnackbar} = useSnackbar();

  const {customer} = useContext(CustomerContext);

  const IconContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
  });
  
  const Icon = styled('div')(({ theme }) => ({
    marginLeft: theme.spacing(1),
  }));

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
            open={open && !isTransactionCompleted}>
        <Box>
          <Container>
              <Box >
                <Typography component="h1" variant="h5" align="left">
                  Payment Details
                </Typography>
              </Box>
              <div style={lineStyle} />
              {orders && orders?.selectedBid && orders.groceryBill && (
              <Box>
              
                <div style={rowStyle}>
                  {/*  total-bill?? */}
                  <Typography variant="body1">Delivery Costs (with fee)</Typography>
                  <Typography variant="body1">{orders?.selectedBid?.moneyBidWithFee.amount} {orders?.selectedBid?.moneyBidWithFee.currency}</Typography>
                </div>
              
                <div style={rowStyle}>
                  <Typography variant="body1">Grocery Bill</Typography>
                  <Typography variant="body1">{orders.groceryBill.costAmount}  {orders.groceryBill.costCurrency}</Typography>
                </div>
               
                <div style={rowStyle}>
                  <Typography variant="body1">Total</Typography>
                  <Typography variant="body1">{(orders.groceryBill.costAmount + orders?.selectedBid?.moneyBidWithFee.amount).toFixed(2)}  {orders.groceryBill.costCurrency}</Typography>
                </div>
              </Box>
              )}
              
              
              <div style={lineStyle} />
              
              <Box>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1">PayPal</Typography>
                  <IconContainer>
                    <Icon>
                      <FaPaypal size={20} />
                    </Icon>
                  </IconContainer>
                </Box>
            
              <Box flex={1} display="flex" justifyContent="center" alignItems="center" marginTop={2}>
                <PayPal onTransactionComplete={handleTransactionComplete} />
              </Box>
            </Box>
              <div style={lineStyle} />
              <Box display="flex" flexDirection="row">
                 <OutlinedButton onClick={handleCancel}>Cancel</OutlinedButton>
                 <DarkButton onClick={handleConfirm}>Confirm</DarkButton>
              </Box>
          </Container>
      </Box>
    </BaseModal>
    
  
}
