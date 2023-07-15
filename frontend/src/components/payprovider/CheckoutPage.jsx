import React, {useContext, useState} from 'react';
import {Box, Container, Typography} from '@mui/material';
import {styled} from '@mui/system';
import {FaPaypal} from 'react-icons/fa';
import {OutlinedButton} from "../util/Buttons";
import {useSnackbar} from "notistack";
import {useFetch} from "../../util/hooks";
import {CustomerContext} from "../../util/context/CustomerContext";
import {useNavigate, useParams} from "react-router-dom";
import {BaseModal} from '../util/BaseModal';
import PayPal from './PayPal';

export function CheckoutPage() {
    const [open, setOpen] = useState(true);
    const [isTransactionCompleted, setTransactionCompleted] = useState(false);
    const params = useParams();
    const [orders] = useFetch(`${process.env.REACT_APP_BACKEND}/api/orders/${params.id}`, {credentials: 'include'})
    const {customer} = useContext(CustomerContext);
    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();

    const handleTransactionComplete = () => {
        setTransactionCompleted(true);
        navigate(`/${customer?.type?.toLowerCase()}/my-orders/${orders?._id}/review`);
    };

    const IconContainer = styled(Box)({
        display: 'flex',
        alignItems: 'center',
    });

    const Icon = styled('div')(({theme}) => ({
        marginLeft: theme.spacing(1),
    }));

    const handleClose = () => {
        setOpen(false);
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
                <Box>
                    <Typography component="h1" variant="h5" align="left">
                        Payment Details
                    </Typography>
                </Box>
                <div style={{borderBottom: '1px solid #E2E8F0', width: '98%', margin: '10px'}}/>
                {orders && orders?.selectedBid && orders.groceryBill && (
                    <Box>

                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                            {/*  total-bill?? */}
                            <Typography variant="body1">Delivery Costs (with fee)</Typography>
                            <Typography
                                variant="body1">{orders?.selectedBid?.moneyBidWithFee.amount.toFixed(2)} {orders?.selectedBid?.moneyBidWithFee.currency}</Typography>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                            <Typography variant="body1">Grocery Bill</Typography>
                            <Typography
                                variant="body1">{orders.groceryBill.costAmount.toFixed(2)} {orders.groceryBill.costCurrency}</Typography>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                            <Typography variant="body1">Total</Typography>
                            <Typography
                                variant="body1">{(orders.groceryBill.costAmount + orders?.selectedBid?.moneyBidWithFee.amount).toFixed(2)} {orders.groceryBill.costCurrency}</Typography>
                        </div>
                    </Box>
                )}


                <div style={{borderBottom: '1px solid #E2E8F0', width: '98%', margin: '10px'}}/>

                <Box>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1">PayPal</Typography>
                        <IconContainer>
                            <Icon>
                                <FaPaypal size={20}/>
                            </Icon>
                        </IconContainer>
                    </Box>

                    <Box flex={1} display="flex" justifyContent="center" alignItems="center" marginTop={2}>
                        <PayPal onTransactionComplete={handleTransactionComplete}/>
                    </Box>
                </Box>
                <div style={{borderBottom: '1px solid #E2E8F0', width: '98%', margin: '10px'}}/>
                <Box display="flex" flexDirection="row">
                    <OutlinedButton sx={{"flex": 1}} onClick={handleCancel}>Cancel</OutlinedButton>
                </Box>
            </Container>
        </Box>
    </BaseModal>
}
