import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Grid, List, ListItem, ListItemButton, ListItemAvatar } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import OrderDetailsModal from './OrderDetailsModal';
import BidOnOrderModal from './BidOnOrderModal';
import { mockedOrders } from '../../util/mockdata';
import { Show } from '../util/ControlFlow';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { GoogleMap, Marker, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';

const ShopperChooseOrderView = () => {
    const [map, setMap] = useState(null);
    const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
    const [showBidOnOrderModal, setShowBidOnOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState(mockedOrders); //todo: delete mockdata
    const [directions, setDirections] = useState(null);
    const [mapKey, setMapKey] = useState(0);

    // We use useState as a way of handling a constant here to stop useJsApiLoader from triggering more than once.
    const [googleLibraries] = useState(["places"]);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCAiDt2WyuMhekA25EMEQgx_wVO_WQW8Ok",
        libraries: googleLibraries
    });

    useEffect(() => {
        if (map) {
            const defaultCenter = {lat: 48.137154, lng: 11.576124}
            map.setCenter(defaultCenter);
        }
    }, [map]);

    useEffect(() => {
        console.log('Fetching orders from backend...');

        const fetchOrders = async () => {
          try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/withCreator`, 
            {
                credentials: "include",
                withCredentials: true
            }
              );
            const data = await response.json();
            console.log('Orders:', data);
            setOrders(data);
            console.log('Orders successfully fetched!');
          } catch (error) {
            console.error('Error fetching orders:', error);
          }
        };
    
        fetchOrders();
      }, []);


    useEffect(() => {
        setDirections(null); //TODO ask lukas why this is working
        setMapKey(prevKey => prevKey + 1);

        if (selectedOrder && selectedOrder.groceryShop && selectedOrder.destination) {
            const DirectionsService = new window.google.maps.DirectionsService();
            DirectionsService.route(
                {
                    origin: selectedOrder.groceryShop.geometry.location,
                    destination: selectedOrder.destination.geometry.location,
                    travelMode: 'DRIVING'
                },
                (result, status) => {
                    if (status === 'OK') {
                        setDirections(result);
                    }
                }
            );
        }
    }, [selectedOrder]);


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

    const handleBidOnOrder = () => {
        // TODO
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
                        direction={{xs: 'column', sm: 'row'}}
                        divider={<Divider orientation="vertical" flexItem/>}
                        spacing={{xs: 1, sm: 1, md: 1}}
                        sx={{mb: 2}}
                    >
                        <TextField
                            id="location"
                            label="Filter Orders"
                            sx={{ width: '100%' }}
                        />
                        <Button variant="contained">Search</Button>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container spacing={5} sx={{ mb: 2 }}>
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
                                                    <Typography variant={"body1"}>Shop: {order?.groceryShop?.name}, {order?.groceryShop?.street}, {order?.groceryShop?.city}</Typography>
                                                    <LocationOnOutlinedIcon />
                                                    <Typography variant={"body1"}>Destination: {order?.destination?.street}, {order?.destination?.city}</Typography>
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
                        ))}
                    </List>
                </Grid>
                <Grid item xs={6} md={8}>
                    <Show when={isLoaded} fallback={<CircularProgress />}>
                        <GoogleMap
                            key={mapKey}
                            mapContainerStyle={{
                                width: '100%',
                                height: '70vh'
                            }}
                            zoom={14}
                            onLoad={map => setMap(map)}
                        >
                            {directions && ( //TODO: show travel time, choose between car and bike 
                                <>
                                    <DirectionsRenderer
                                        options={{
                                            directions: directions,
                                            suppressMarkers: true,
                                            preserveViewport: false,
                                        }}
                                    />

                                    <Marker
                                        key={selectedOrder.groceryShop.place_id}
                                        position={selectedOrder.groceryShop.geometry.location}
                                        label="Shop"
                                    />

                                    <Marker
                                        key={selectedOrder.destination.place_id}
                                        position={selectedOrder.destination.geometry.location}
                                        label="Destination"
                                    />
                                </>
                            )}
                        </GoogleMap>
                    </Show>
                </Grid>
            </Grid>
            <Box display='flex' alignItems='center' justifyContent="flex-end" >
                <Button variant="contained" onClick={handleBidOnOrder}>Bid on Order</Button> 
            </Box>
        </>
    );
};

export { ShopperChooseOrderView };
