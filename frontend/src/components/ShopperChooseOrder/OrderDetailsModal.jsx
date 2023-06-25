import React from 'react';
import {Box} from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {BaseModal} from "../util/BaseModal"
import {useTheme} from "@mui/material/styles"
import {SingleOrderViewShopper} from '../MyOrders/SingleOrderViewShopper';


const OrderDetailsModal = ({showOrderDetailsModal, handleCloseOrderDetailsModal, handleOpenBidModal, order}) => {

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
        overflow: 'auto', // TODO: Take Lukas Modal!!!! (Also in all other occurrences of Modal)
    };


    const handleShowBidModal = async () => {
        handleCloseOrderDetailsModal();
        handleOpenBidModal();
    };

    return (
        <div>
            <BaseModal
                open={showOrderDetailsModal}
                onClose={handleCloseOrderDetailsModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <Box sx={style}>

                        <SingleOrderViewShopper order={order}/>

                        <Stack
                            direction={{xs: 'column', sm: 'row'}}
                            spacing={{xs: 1, sm: 1, md: 1}}
                            sx={{mt: 2, justifyContent: 'space-between', width: "100%"}}
                        >
                            <Button variant="contained" onClick={handleCloseOrderDetailsModal}>Back</Button>
                            <Button variant="contained" onClick={handleShowBidModal}>Create Bid</Button>
                        </Stack>

                    </Box>
                </>
            </BaseModal>
        </div>
    );
};

export default OrderDetailsModal;