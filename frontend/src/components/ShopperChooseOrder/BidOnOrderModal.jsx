import React, {useState} from 'react';
import {Box} from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import {useTheme} from "@mui/material/styles"
import { useSnackbar } from 'notistack';


const BidOnOrderModal = ({ showBidOnOrderModal, handleCloseBidOnOrderModal, Order  }) => {  
    const [bidHight, setBidHight] = useState(0);
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
            <Modal
                open={showBidOnOrderModal}
                onClose={handleCloseBidOnOrderModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <Box sx={style}>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            Bid on this Order
                        </Typography>
                        <Box
                            sx={{ width: "100%" }}
                        >
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <TextField
                                        required
                                        id="outlined"
                                        label="Name"
                                        margin="dense"
                                        sx={{ width: '100%' }}
                                        onChange={(e) => setBidHight( e.currentTarget.value )}
                                    />
                                </div>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={{ xs: 1, sm: 1, md: 1 }}
                                    sx={{ mt: 2, justifyContent: 'space-between' }}
                                >
                                    <Button variant="contained" onClick={handleCloseBidOnOrderModal}>Back</Button>
                                    <Button variant="contained" type="submit">Bid</Button>
                                </Stack>
                            </form>
                        </Box>
                    </Box>
                </>
            </Modal>
        </div>
    );
};

export default BidOnOrderModal;