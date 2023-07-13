import React, {useContext, useState} from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import PaymentForm from './PaymentForm';
import {DarkButton} from "../util/Buttons";
import {useSnackbar} from "notistack";
import {useFetch} from "../../util/hooks";
import {CustomerContext} from "../../util/context/CustomerContext";
import {useNavigate, useParams} from "react-router-dom";
import {BaseModal} from '../util/BaseModal';


export function CheckoutPage() {
    const [open, setOpen] = useState(true);
    const params = useParams();

    const [orders, ] = useFetch(`${process.env.REACT_APP_BACKEND}/api/orders/${params.id}`, {credentials: 'include'})
    console.log(orders);


    const navigate = useNavigate();

    const {enqueueSnackbar} = useSnackbar();

    const {customer} = useContext(CustomerContext);

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
        open={open}
        style={modalStyle}>
        <div>
            <Container>
                <div className="payment-details" style={paymentDetailsStyle}>
                    <Typography component="h1" variant="h5" align="left">
                        Payment Details
                    </Typography>
                </div>
                <div style={lineStyle}/>

                <div style={contentStyle}>
                    {orders && orders?.selectedBid && (
                        <div style={rowStyle}>
                            {/*  total-bill?? */}
                            <Typography variant="body1">Delivery Costs (with fee)</Typography>
                            <Typography
                                variant="body1">{orders?.selectedBid?.moneyBidWithFee.amount} {orders?.selectedBid?.moneyBidWithFee.currency}</Typography>
                        </div>
                    )}

                    {orders && orders.groceryBill && (
                        <div style={rowStyle}>
                            <Typography variant="body1">Grocery Bill</Typography>
                            <Typography
                                variant="body1">{orders.groceryBill.costAmount} {orders.groceryBill.costCurrency}</Typography>
                        </div>
                    )}
                    {orders && orders?.selectedBid && (
                        <div style={rowStyle}>
                            <Typography variant="body1">Total</Typography>
                            {/* TODO  Technically, we can not just add the two numbers if currencies diverge */}
                            <Typography
                                variant="body1">{(orders?.selectedBid?.moneyBidWithFee.amount + orders.groceryBill.costAmount).toFixed(2)} {orders?.selectedBid?.moneyBidWithFee.currency}</Typography>
                        </div>
                    )}
                </div>


                <div style={lineStyle}/>
                <PaymentForm/>
                <div style={lineStyle}/>
                <div style={buttonContainerStyle}>
                    <Button sx={cancelButtonStyle} variant="contained" onClick={handleCancel}>
                        Cancel
                    </Button>

                    <DarkButton onClick={handleConfirm}>
                        Confirm
                    </DarkButton>

                </div>
            </Container>
        </div>
    </BaseModal>


}
