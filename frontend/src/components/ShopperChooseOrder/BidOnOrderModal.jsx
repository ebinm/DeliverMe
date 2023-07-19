import React, {useState} from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {BaseModal} from "../util/BaseModal"
import {useSnackbar} from 'notistack';
import {DateTimePicker} from "@mui/x-date-pickers";
import {CustomDateTimePickerActionBar} from "../util/CustomDateTimePickerActionBar";
import {CurrencyInput} from "../util/CurrencyInput";
import {GuardCustomerType} from "../util/GuardCustomerType";
import {DarkButton, OutlinedButton} from "../util/Buttons";
import {PUT_FETCH_OPTIONS} from "../../util/util";
import {InfoPopper} from "../util/HoverPopper";
import Typography from "@mui/material/Typography";


const BidOnOrderModal = ({showBidOnOrderModal, handleCloseBidOnOrderModal, handleCloseOrderDetailsModal, order, getOpenOrders}) => {

    const [bidAmount, setBidAmount] = useState(0);
    const [bidCurrency, setBidCurrency] = useState("EUR");
    const [bidDate, setBidDate] = useState(null);
    const [bidNotes, setBidNotes] = useState("");


    const {enqueueSnackbar} = useSnackbar();


    const handleSubmit = async () => {

        const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${order._id}/bid`, {
            ...PUT_FETCH_OPTIONS, body: JSON.stringify({
                moneyBid: {
                    currency: bidCurrency, amount: bidAmount,
                }, timeBid: bidDate, note: bidNotes,
            })
        })

        if (res.ok) {
            handleCloseBidOnOrderModal();
            handleCloseOrderDetailsModal();
            enqueueSnackbar('Bid successfully created!', {variant: 'success'});
            setBidAmount(0)
            // We keep the currency
            setBidDate(null)
            setBidNotes("")
            getOpenOrders()
        } else {
            enqueueSnackbar('Could not place bid. Make sure you have bid a positive amount.', {variant: 'error'});
        }


        console.log("bid submitted", bidAmount)
    };


    return (<GuardCustomerType requiredType={"SHOPPER"}>{() => <BaseModal
        open={showBidOnOrderModal}
        onClose={handleCloseBidOnOrderModal}
        title={"Create your Bid"}
    >
        <Stack gap={"8px"}>
            <CurrencyInput sx={{"width": "100%"}} align="center" label={"Bid Amount"} amount={bidAmount}
                           setAmount={setBidAmount}
                           textFieldInputProps={{
                               endAdornment: <InfoPopper><Typography>Here you specify your personal fee for completing
                                   this purchase. You will receive this fee in addition to the actual cost of the
                                   purchase from the shopper.</Typography></InfoPopper>

                           }}
                           currency={bidCurrency} setCurrency={setBidCurrency}/>

            <DateTimePicker
                label={"Expected Deliver Time"}
                disablePast
                name={"BidDate"}
                value={bidDate}
                onChange={value => !isNaN(value) && setBidDate(value)}
                slots={{"actionBar": ((props) => <CustomDateTimePickerActionBar {...props} />)}}
                slotProps={{"textField": {variant: "outlined"}}}/>

            <TextField
                value={bidNotes} onChange={e => setBidNotes(e.target.value)}
                multiline label={"Additional Notes"}
            />


            <Stack
                direction={{xs: 'column', sm: 'row'}}
                sx={{mt: 4, justifyContent: 'flex-end'}}
                gap={"8px"}
            >
                <OutlinedButton onClick={handleCloseBidOnOrderModal}>Back</OutlinedButton>
                <DarkButton onClick={handleSubmit}>Place bid</DarkButton>
            </Stack>

        </Stack>
    </BaseModal>}</GuardCustomerType>);
};

export default BidOnOrderModal;
