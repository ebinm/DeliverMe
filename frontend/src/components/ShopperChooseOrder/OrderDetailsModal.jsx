import React from 'react';
import {Box} from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {BaseModal} from "../util/BaseModal"
import {SingleOrderViewShopper} from '../MyOrders/SingleOrderViewShopper';


const OrderDetailsModal = ({showOrderDetailsModal, handleCloseOrderDetailsModal, handleOpenBidModal, order}) => {
    const handleShowBidModal = async () => {
        handleCloseOrderDetailsModal();
        handleOpenBidModal();
    };

    return (
        <div>
            <BaseModal
                sx={{"width": "100vh"}}
                open={showOrderDetailsModal}
                onClose={handleCloseOrderDetailsModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <>
                    <Box sx={{"width": "100%"}}>

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