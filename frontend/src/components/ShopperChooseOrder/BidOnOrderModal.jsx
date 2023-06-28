import React, {useState} from 'react';
import {Box} from '@mui/material';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {BaseModal} from "../util/BaseModal"
import {useTheme} from "@mui/material/styles"
import {useSnackbar} from 'notistack';
import {DateTimePicker} from "@mui/x-date-pickers";
import {CustomDateTimePickerActionBar} from "../util/CustomDateTimePickerActionBar";
import {CurrencyInput} from "../util/CurrencyInput";
import {GuardCustomerType} from "../util/GuardCustomerType";
import {DarkButton, OutlinedButton} from "../util/Buttons";
import {PUT_FETCH_OPTIONS} from "../../util/util";


const BidOnOrderModal = ({showBidOnOrderModal, handleCloseBidOnOrderModal, order}) => {

    const [bidAmount, setBidAmount] = useState(0);
    const [bidCurrency, setBidCurrency] = useState("EUR");
    const [bidDate, setBidDate] = useState(null);
    const [bidNotes, setBidNotes] = useState("");


    const {enqueueSnackbar} = useSnackbar();
    const theme = useTheme()


    const style = {
        width: "100vh",
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: theme.palette.primary.main,
        boxShadow: 24,
        p: 4,
        borderRadius: '10px',
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };


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
            enqueueSnackbar('Snackbar message', {variant: 'success'});
        }


        console.log("bid submitted", bidAmount)
    };


    return (
        <GuardCustomerType requiredType={"SHOPPER"}>{ () =>
            <div>
                <BaseModal
                    open={showBidOnOrderModal}
                    onClose={handleCloseBidOnOrderModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <>
                        <Box sx={style}>
                            <Typography variant="h4" sx={{mb: 2}}>
                                Bid on this Order
                            </Typography>
                            <Stack direction={"column"} width={"100%"} gap={"16px"}>

                                <CurrencyInput label={"Bid Amount"} amount={bidAmount} setAmount={setBidAmount}
                                               currency={bidCurrency} setCurrency={setBidCurrency}/>

                                <DateTimePicker
                                    label={"Expected Deliver Time"}
                                    disablePast
                                    name={"BidDate"}
                                    value={bidDate}
                                    onChange={value => !isNaN(value) && setBidDate(value)}
                                    slots={{"actionBar": ((props) => <CustomDateTimePickerActionBar {...props} />)}}
                                    slotProps={{"textField": {variant: "standard"}}}/>

                                <TextField
                                    value={bidNotes} onChange={e => setBidNotes(e.target.value)}
                                    multiline label={"Additional Notes"}
                                />


                                <Stack
                                    direction={{xs: 'column', sm: 'row-reverse'}}
                                    spacing={{xs: 1, sm: 1, md: 1}}
                                    sx={{mt: 4}}
                                >
                                    <DarkButton onClick={handleSubmit}>Place bid</DarkButton>
                                    <OutlinedButton onClick={handleCloseBidOnOrderModal}>Back</OutlinedButton>
                                </Stack>

                            </Stack>
                        </Box>
                    </>
                </BaseModal>
            </div>
        }</GuardCustomerType>
    );
};

export default BidOnOrderModal;
