import React, { useState } from 'react';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { BaseModal } from "../util/BaseModal"
import { useSnackbar } from 'notistack';
import { DateTimePicker } from "@mui/x-date-pickers";
import { CustomDateTimePickerActionBar } from "../util/CustomDateTimePickerActionBar";
import { CurrencyInput } from "../util/CurrencyInput";
import { GuardCustomerType } from "../util/GuardCustomerType";
import { DarkButton, OutlinedButton } from "../util/Buttons";
import { PUT_FETCH_OPTIONS } from "../../util/util";


const BidOnOrderModal = ({ showBidOnOrderModal, handleCloseBidOnOrderModal, handleCloseOrderDetailsModal, order }) => {

    const [bidAmount, setBidAmount] = useState(0);
    const [bidCurrency, setBidCurrency] = useState("EUR");
    const [bidDate, setBidDate] = useState(null);
    const [bidNotes, setBidNotes] = useState("");


    const { enqueueSnackbar } = useSnackbar();


    const handleSubmit = async () => {

        const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${order._id}/bid`, {
            ...PUT_FETCH_OPTIONS,
            body: JSON.stringify({
                moneyBid: {
                    currency: bidCurrency,
                    amount: bidAmount,
                },
                timeBid: bidDate,
                note: bidNotes,
            })
        })

        if (res.ok) {
            handleCloseBidOnOrderModal();
            handleCloseOrderDetailsModal();
            enqueueSnackbar('Bid Successful created!', { variant: 'success' });
        }


        console.log("bid submitted", bidAmount)
    };


    return (
        <GuardCustomerType requiredType={"SHOPPER"}>{() =>
            <BaseModal
                open={showBidOnOrderModal}
                onClose={handleCloseBidOnOrderModal}
                title={"Create your Bid"}
            >
                <>
                    <CurrencyInput sx={{"width":"100%"}} align="center" label={"Bid Amount"} amount={bidAmount} setAmount={setBidAmount}
                        currency={bidCurrency} setCurrency={setBidCurrency} />

                    <DateTimePicker
                        label={"Expected Deliver Time"}
                        disablePast
                        name={"BidDate"}
                        value={bidDate}
                        onChange={value => !isNaN(value) && setBidDate(value)}
                        slots={{ "actionBar": ((props) => <CustomDateTimePickerActionBar {...props} />) }}
                        slotProps={{ "textField": { variant: "standard" } }} />

                    <TextField
                        value={bidNotes} onChange={e => setBidNotes(e.target.value)}
                        multiline label={"Additional Notes"}
                    />


                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        sx={{ mt: 4, justifyContent: 'space-between' }}
                    >
                        <OutlinedButton onClick={handleCloseBidOnOrderModal}>Back</OutlinedButton>
                        <DarkButton onClick={handleSubmit}>Place bid</DarkButton>

                    </Stack>

                </>
            </BaseModal>
        }</GuardCustomerType>
    );
};

export default BidOnOrderModal;
