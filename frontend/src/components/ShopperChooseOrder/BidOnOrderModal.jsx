import React, { useState } from 'react';
import { Box, InputAdornment, OutlinedInput, FilledInput, Input } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {BaseModal} from "../util/BaseModal"
import { useTheme } from "@mui/material/styles"
import { useSnackbar } from 'notistack';
import { DateTimePicker } from "@mui/x-date-pickers";
import { CustomDateTimePickerActionBar } from "../util/CustomDateTimePickerActionBar";


const BidOnOrderModal = ({ showBidOnOrderModal, handleCloseBidOnOrderModal, Order }) => {
    const [bidHight, setBidHight] = useState(0);
    const [bidDate, setBidDate] = useState();
    const { enqueueSnackbar } = useSnackbar();
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


    const handleSubmit = (e) => {
        e.preventDefault();
        handleCloseBidOnOrderModal();
        enqueueSnackbar('Snackbar message', { variant: 'success' });

        console.log("bid submitted", bidHight)
    };

    return (
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
                        <Box
                            sx={{width: "100%"}}
                        >
                            <form onSubmit={handleSubmit}>
                       
                                    <Typography justifySelf={"flex-end"} sx={{ mt: 3}}>Bid Amount</Typography>
                                    <Input
                                        id="BidAmount"
                                        endAdornment={<InputAdornment position="end">€</InputAdornment>}
                                        onChange={(e) => setBidHight(e.currentTarget.value)}
                                        value={bidHight}
                                        style={{width: "100%"}}
                                    />
                                    <Typography justifySelf={"flex-end"} sx={{ mt: 3 }}>Expected Deliver Time</Typography>
                                    <DateTimePicker
                                        disablePast
                                        name={"BidDate"}
                                        value={bidDate}
                                        onChange={value => !isNaN(value) && setBidDate(value)}
                                        slots={{ "actionBar": ((props) => <CustomDateTimePickerActionBar {...props} />) }}
                                        slotProps={{ "textField": { variant: "standard" } }} />
                                       
                            

                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={{ xs: 1, sm: 1, md: 1 }}
                                    sx={{ mt: 4, justifyContent: 'space-between' }}
                                >
                                    <Button variant="contained" onClick={handleCloseBidOnOrderModal}>Back</Button>
                                    <Button variant="contained" type="submit">Bid</Button>
                                </Stack>
                            </form>
                        </Box>
                    </Box>
                </>
            </BaseModal>
        </div>
    );
};

export default BidOnOrderModal;