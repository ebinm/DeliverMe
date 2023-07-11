import React from 'react';
import Stack from '@mui/material/Stack';
import { BaseModal } from "../util/BaseModal"
import { DarkButton, OutlinedButton } from "../util/Buttons";
import { SingleOrderViewShopper } from '../MyOrders/SingleOrderViewShopper';


const OrderDetailsModal = ({ showOrderDetailsModal, handleCloseOrderDetailsModal, handleOpenBidModal, order }) => {
    const handleShowBidModal = async () => {
        handleCloseOrderDetailsModal();
        handleOpenBidModal();
    };

    return (
        <div>
            <BaseModal
                open={showOrderDetailsModal}
                onClose={handleCloseOrderDetailsModal}
                title={null}
            >
                <>
                    <SingleOrderViewShopper order={order} />

                    <Stack
                        gap={"8px"}
                        direction={{ xs: 'column', sm: 'row' }}
                        sx={{ mt: 2, justifyContent: 'flex-end', width: "100%" }}
                    >
                        <OutlinedButton onClick={handleCloseOrderDetailsModal}>Back</OutlinedButton>
                        <DarkButton onClick={handleShowBidModal}>Create Bid</DarkButton>
                    </Stack>

                </>
            </BaseModal>
        </div>
    );
};

export default OrderDetailsModal;