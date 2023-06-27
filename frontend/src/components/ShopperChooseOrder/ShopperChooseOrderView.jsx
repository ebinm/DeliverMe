import React, {useEffect, useState} from 'react';
import {CircularProgress, Grid, List} from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import OrderDetailsModal from './OrderDetailsModal';
import BidOnOrderModal from './BidOnOrderModal';
import {Show} from '../util/ControlFlow';
import {DirectionsRenderer, GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import {OrderFilter} from './OrderFilter';
import {OrderListItem} from './OrderListItem';


const ShopperChooseOrderView = () => {
    const [map, setMap] = useState(null);
    const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
    const [showBidOnOrderModal, setShowBidOnOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
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
            const defaultCenter = { lat: 48.137154, lng: 11.576124 }
            map.setCenter(defaultCenter);
        }
    }, [map]);

    useEffect(() => {
        console.log('Fetching orders from backend...');

        const fetchOrders = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/open`,
                    {
                        credentials: "include",
                        withCredentials: true
                    }
                );
                const data = await response.json();
                console.log('Orders:', data);
                setOrders(data);
                setFilteredOrders(data);
                console.log('Orders successfully fetched!');
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);


    useEffect(() => {
        // TODO ask Simon how the location for the destination is found
        setDirections(null); //TODO ask lukas why this is working
        setMapKey(prevKey => prevKey + 1);

        if (selectedOrder && selectedOrder.groceryShop && selectedOrder.destination?.geometry ) {
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
            console.warn("n")
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
        setShowOrderDetailsModal(true);
    };

    return (
        <>
            <OrderDetailsModal
                showOrderDetailsModal={showOrderDetailsModal}
                handleCloseOrderDetailsModal={handleCloseOrderDetailsModal}
                handleOpenBidModal={handleOpenBidOnOrderModal}
                order={selectedOrder}
            />
            <BidOnOrderModal
                showBidOnOrderModal={showBidOnOrderModal}
                handleCloseBidOnOrderModal={handleCloseBidOnOrderModal}
                order={selectedOrder}
            />

            <Grid container sx={{ mb: 2 }}>
                <Typography variant="h4" component="h1" sx={{ paddingLeft: '16px' }}>Open Orders</Typography>
            </Grid>
            <Grid container spacing={5} sx={{ mb: 2 }}>
                <Grid item xs={6} md={4} sx={{ maxHeight: '70vh', overflow: 'auto' }}>

                    <OrderFilter orders={orders} setFilteredOrders={setFilteredOrders} />

                    <Divider />

                    <List >
                        {filteredOrders.map((order) => (
                            <OrderListItem key={order._id} order={order}
                            handleOpenOrderDetailsModal={handleOpenOrderDetailsModal} 
                            selectedOrder={selectedOrder} 
                            setSelectedOrder={setSelectedOrder} />
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
        </>
    );
};

export { ShopperChooseOrderView };
