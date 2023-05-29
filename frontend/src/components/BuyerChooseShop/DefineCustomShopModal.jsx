import React from 'react';
import {Box} from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import {useTheme} from "@mui/material/styles"


const DefineCustomShopModal = ({ showModal, handleCloseModal, setUseCustomShop, setCustomShopValues, CustomShopValues }) => {

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
        setUseCustomShop(true);
        handleCloseModal();
    };

    return (
        <div>
            <Modal
                open={showModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <Box sx={style}>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            Custom Shop Form
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
                                        onChange={(e) => setCustomShopValues({ ...CustomShopValues, Name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        required
                                        id="filled-error-helper-text"
                                        label="Street Address"
                                        margin="dense"
                                        sx={{ width: '100%' }}
                                        onChange={(e) => setCustomShopValues({ ...CustomShopValues, Street: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        required
                                        id="standard-error"
                                        label="City"
                                        margin="dense"
                                        sx={{ width: '100%' }}
                                        onChange={(e) => setCustomShopValues({ ...CustomShopValues, City: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        required
                                        id="standard-error"
                                        label="State"
                                        margin="dense"
                                        sx={{ width: '100%' }}
                                        onChange={(e) => setCustomShopValues({ ...CustomShopValues, State: e.target.value })}
                                    />
                                </div>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={{ xs: 1, sm: 1, md: 1 }}
                                    sx={{ mt: 2, justifyContent: 'space-between' }}
                                >
                                    <Button variant="contained" onClick={handleCloseModal}>Back</Button>
                                    <Button variant="contained" type="submit">Select Shop</Button>
                                </Stack>
                            </form>
                        </Box>
                    </Box>
                </>
            </Modal>
        </div>
    );
};

export default DefineCustomShopModal;