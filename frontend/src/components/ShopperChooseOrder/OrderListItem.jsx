import React from 'react';
import { Box, IconButton, ListItem, ListItemAvatar, ListItemButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import MopedOutlinedIcon from '@mui/icons-material/MopedOutlined';
import Rating from "@mui/material/Rating";


const OrderListItem = ({ order, handleOpenReviewsModal, handleOpenOrderDetailsModal, selectedOrder, setSelectedOrder }) => {

    const stars = order.createdBy.avgRating

    return (
        <ListItem key={order._id}>
            <ListItemButton
                selected={selectedOrder === order}
                onClick={() => {
                    setSelectedOrder(order);
                }}
                sx={{ bgcolor: "white", borderRadius: '10px', boxShadow: 3}}
            >
                <Box sx={{ width: "100%", m:2}}>
                    <Box>
                        <Box display={"grid"} gridTemplateColumns={"min-content auto"} gap={"8px"}>
                            <ListItemAvatar>
                                <Avatar alt={order?.createdBy?.firstName + " " + order?.createdBy?.lastName}
                                    src={order?.createdBy?.profilePicture} />
                            </ListItemAvatar>
                            <Stack direction={"row"} flexWrap={"wrap"} gap={"10px"} sx={{ mb: 2 }}>
                                <Typography sx={{ mt: "6px" }} variant={"h6"}
                                    fontWeight="bold">{order?.createdBy?.firstName} {order?.createdBy?.lastName}</Typography>
                                <Rating sx={{ mt: "8px" }} readOnly defaultValue={stars || null} precision={0.5} />
                                <IconButton aria-label="info" onClick={handleOpenReviewsModal}>
                                    <InfoIcon />
                                </IconButton>
                            </Stack>

                            <ShoppingCartOutlinedIcon />
                            {(order?.groceryShop) ?
                                <Typography
                                    variant={"body1"}><b>Shop:</b> {order?.groceryShop?.name}, {order?.groceryShop?.street}, {order?.groceryShop?.city}
                                </Typography>
                                :
                                <Typography variant={"body1"}><b>Shop:</b> No Shop Specified</Typography>
                            }

                            <LocationOnOutlinedIcon />
                            <Typography
                                variant={"body1"}><b>Destination:</b> {order?.destination?.street}, {order?.destination?.city}
                            </Typography>

                            <ListOutlinedIcon />
                            <Typography variant={"body1"}><b>Number Items:</b> {order?.items.length}</Typography>

                            <MopedOutlinedIcon />
                            <Box>
                            <Typography variant={"body1"}><b>Travel Planer:</b></Typography>
                                <Box sx={{ml:1}} display={"grid"} gridTemplateColumns={"max-content max-content max-content max-content max-content"}>
                                    
                                    <Typography sx={{mr:1}} variant={"body1"}>Current Location</Typography>
                                    <Typography sx={{mr:1}} variant={"body1"}>-{'>'}</Typography>
                                    <Typography sx={{mr:1}} variant={"body1"}>Shop</Typography>
                                    <Typography sx={{mr:1}} variant={"body1"}>= {order?.directions?.legs[0].distance.text}</Typography>
                                    <Typography variant={"body1"}>| {order?.directions?.legs[0].duration.text}</Typography>


                                    <Typography sx={{mr:1}} variant={"body1"}>Shop</Typography>
                                    <Typography sx={{mr:1}} variant={"body1"}>-{'>'}</Typography>
                                    <Typography sx={{mr:1}} variant={"body1"}>Customer</Typography>
                                    <Typography sx={{mr:1}} variant={"body1"}>= {order?.directions?.legs[1].distance.text}</Typography>
                                    <Typography variant={"body1"}>| {order?.directions?.legs[1].duration.text}</Typography>

                                    <Typography sx={{mr:1}} variant={"body1"}>Customer</Typography>
                                    <Typography sx={{mr:1}} variant={"body1"}>-{'>'}</Typography>
                                    <Typography sx={{mr:1}} variant={"body1"}>Current Location</Typography>
                                    <Typography sx={{mr:1}} variant={"body1"}>= {order?.directions?.legs[1].distance.text}</Typography>
                                    <Typography variant={"body1"}>| {order?.directions?.legs[1].duration.text}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{m:2}} />

                    <Button sx={{
                        width: '100%',
                        color: 'gray',
                        textTransform: 'none',
                        justifyContent: 'space-between',
                        mt: 1,
                        mb: 2
                    }} endIcon={<ArrowForwardIosIcon />} onClick={handleOpenOrderDetailsModal}>
                        <Typography variant="body1">See more details & place bid</Typography>
                    </Button>
                </Box>
            </ListItemButton>
        </ListItem>
    )
};

export { OrderListItem };