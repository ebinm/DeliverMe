import React from 'react';
import {Box, ListItem, ListItemAvatar, ListItemButton} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import {Show} from "../util/ControlFlow";
import Rating from "@mui/material/Rating";


const OrderListItem = ({ order, handleOpenOrderDetailsModal, selectedOrder, setSelectedOrder }) => {

    const stars = Math.min(5, Math.floor(order.createdBy.avgRating))

    return (
        <ListItem key={order._id}>
        <ListItemButton
            selected={selectedOrder === order}
            onClick={() => {
                setSelectedOrder(order);
            }}
            sx={{ bgcolor: "white", borderRadius: '10px', boxShadow: 3 }}
        >
            <Box sx={{ width: "100%" }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 1, md: 1 }}
                    sx={{ mb: 2 }}
                >
                    <Box display='flex' alignItems='center'>
                        <ListItemAvatar>
                            <Avatar  alt={order?.createdBy?.firstName + " " + order?.createdBy?.lastName}
                                src={`data:image/jpeg;base64,${order?.createdBy?.profilePicture}`} />
                        </ListItemAvatar>
                    </Box>
                    <Box>
                        <Box display={"grid"} gridTemplateColumns={"max-content max-content"} gap={"10px"}>
                        <Typography sx={{mb:1}} variant={"h6"} fontWeight="bold">{order?.createdBy?.firstName} {order?.createdBy?.lastName}</Typography>
                        <Rating readOnly defaultValue={stars || null} precision={0.5} />
                        </Box>
                        <Box display={"grid"} gridTemplateColumns={"min-content auto"} gap={"2px"} >
                            <Show when={order?.groceryShop}>
                                <ShoppingCartOutlinedIcon />
                                <Typography variant={"body1"}>Shop: {order?.groceryShop?.name}, {order?.groceryShop?.street}, {order?.groceryShop?.city}</Typography>
                            </Show>
                            <LocationOnOutlinedIcon />
                            <Typography variant={"body1"}>Destination: {order?.destination?.street}, {order?.destination?.city}</Typography>
                            <ListOutlinedIcon/>
                            <Typography variant={"body1"}>Number Items: {order?.items.length}</Typography>
                        </Box>
                    </Box>
                </Stack>

                <Divider />
                <Button sx={{ width: '100%', color: 'gray', textTransform: 'none', justifyContent: 'space-between', mt: 1, mb: 2 }} endIcon={<ArrowForwardIosIcon />} onClick={handleOpenOrderDetailsModal}>
                    <Typography variant="body1">See more details & place bid</Typography>
                </Button>
            </Box>
        </ListItemButton>
    </ListItem>
    )
};

export {OrderListItem};