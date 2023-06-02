import React from 'react';
import {Box} from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import {useTheme} from '@mui/material/styles';


const TestExample = () => {

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

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <Box sx={style}>
                        <Typography variant="h4" sx={{mb: 2}}>
                            Custom Shop Form
                        </Typography>
                        <Box
                            sx={{width: "100%"}}
                        >
                            <form>
                                <div>
                                    <TextField
                                        required
                                        id="outlined"
                                        label="Name"
                                        defaultValue="Hello World"
                                        margin="dense"
                                        sx={{width: '100%'}}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        required
                                        id="filled-error-helper-text"
                                        label="Street Address"
                                        defaultValue="Hello World"
                                        margin="dense"
                                        sx={{width: '100%'}}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        required
                                        id="standard-error"
                                        label="City"
                                        defaultValue="Hello World"
                                        margin="dense"
                                        sx={{width: '100%'}}
                                    />
                                </div>
                                <Stack
                                    direction={{xs: 'column', sm: 'row'}}
                                    spacing={{xs: 1, sm: 1, md: 1}}
                                    sx={{mt: 2, justifyContent: 'space-between'}}
                                >
                                    <Button variant="contained">Back</Button>
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

export default TestExample;