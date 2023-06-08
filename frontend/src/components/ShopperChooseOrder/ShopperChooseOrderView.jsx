import React, { useEffect, useState } from 'react';
import { Box, Grid, List, ListItem, ListItemButton, ListItemText, IconButton, ListItemAvatar } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { GoogleMap, InfoWindow, LoadScript, Marker, } from '@react-google-maps/api';
import OrderDetailsModal from './OrderDetailsModal';
import BidOnOrderModal from './BidOnOrderModal';
import { mockedOrders } from '../../util/mockdata';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ShopperChooseOrderView = () => {
    const [map, setMap] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
    const [showBidOnOrderModal, setShowBidOnOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [orders] = useState(mockedOrders)


    useEffect(() => {
        if (map) {
            const defaultCenter = { lat: 48.137154, lng: 11.576124 }
            map.setCenter(defaultCenter);
            setMapCenter(defaultCenter);
        }
    }, [map]);


    const handleOpenOrderDetailsModal = () => {
        setShowOrderDetailsModal(true);
    };

    const handleCloseOrderDetailsModal = () => {
        setShowOrderDetailsModal(false);
    };

    const handleOpenBidOnOrderModal = () => {
        setShowBidOnOrderModal(true);
    };

    const handleCloseBidOnOrderModal = () => {
        setShowBidOnOrderModal(false);
        //setShowOrderDetailsModal(true);
    };


    return (
        <>
            <OrderDetailsModal
                showOrderDetailsModal={showOrderDetailsModal}
                handleCloseOrderDetailsModal={handleCloseOrderDetailsModal}
                handleOpenBidModal={handleOpenBidOnOrderModal}
                Order={selectedOrder}
            />
            <BidOnOrderModal
                showBidOnOrderModal={showBidOnOrderModal}
                handleCloseBidOnOrderModal={handleCloseBidOnOrderModal}
                Order={selectedOrder}
            />

            <Grid container spacing={5}>
                <Grid item xs={6} md={4}>
                    <Typography variant="h4" component="h1" sx={{ paddingLeft: '16px' }}>Orders</Typography>
                </Grid>
                <Grid item xs={6} md={8}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={{ xs: 1, sm: 1, md: 1 }}
                        sx={{ mb: 2 }}
                    >
                        <TextField
                            id="location"
                            label="Seach Location"
                            sx={{ width: '100%' }}
                        />
                        <Button variant="contained" >Search</Button>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container spacing={5} sx={{ mb: 2 }}>
                <LoadScript
                    googleMapsApiKey="AIzaSyDtlTfWb_VyQaJfgkmuKG8qqSl0-1Cj_FQ"
                    libraries={["places"]}
                >
                    <Grid item xs={6} md={4} sx={{ maxHeight: '70vh', overflow: 'auto' }}>
                        <List >
                            {orders.map((order) => (
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
                                                        <Avatar>
                                                            <ImageIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                </Box>
                                                <Box>
                                                    <Typography variant={"h6"} fontWeight="bold">{order?.createdBy?.firstName}, {order?.createdBy?.lastName}</Typography>
                                                    <Box display={"grid"} gridTemplateColumns={"min-content auto"} gap={"1px"} >
                                                        <ShoppingCartOutlinedIcon />
                                                        <Typography variant={"body1"}>{order?.groceryShop?.name}, {order?.groceryShop?.street}</Typography>
                                                        <LocationOnOutlinedIcon />
                                                        <Typography variant={"body1"}>{order?.groceryShop?.city}, {order?.groceryShop?.country}</Typography>
                                                    </Box>
                                                </Box>
                                            </Stack>

                                            <Divider/>
                                            <Button sx={{ width: '100%', color: 'gray', textTransform: 'none', justifyContent: 'space-between', mt:1, mb:2}} endIcon={<ArrowForwardIosIcon />} onClick={handleOpenOrderDetailsModal}>
                                                <Typography variant="body1">See more details & place bid</Typography>
                                            </Button>
                                        </Box>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item xs={6} md={8}>
                        <GoogleMap
                            mapContainerStyle={{
                                width: '100%',
                                height: '70vh'
                            }}
                            zoom={14}
                            onLoad={map => setMap(map)}
                        >
                        </GoogleMap>
                    </Grid>
                </LoadScript>
            </Grid>
        </>
    );
};

export { ShopperChooseOrderView };
