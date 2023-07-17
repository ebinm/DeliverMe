import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { CircularProgress, List, ListItem } from '@mui/material';
import OrderDetailsModal from './OrderDetailsModal';
import BidOnOrderModal from './BidOnOrderModal';
import { Show } from '../util/ControlFlow';
import { DirectionsRenderer, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { OrderFilter } from './OrderFilter';
import { OrderListItem } from './OrderListItem';
import { GuardCustomerType } from "../util/GuardCustomerType";
import { DarkButton } from "../util/Buttons";
import { useSnackbar } from 'notistack';
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReviewsModal } from "../util/ReviewsModal";
import { set } from 'mongoose';

const ShopperChooseOrderView = () => {

    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up("md"))


    const [map, setMap] = useState(null);
    const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
    const [showReviewsModal, setShowReviewsModal] = useState(false);
    const [showBidOnOrderModal, setShowBidOnOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [directions, setDirections] = useState(null);
    const [mapKey, setMapKey] = useState(0);
    const [userLocation, setUserLocation] = useState(null);
    const [ordersLoaded, setOrdersLoaded] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    // We use useState as a way of handling a constant here to stop useJsApiLoader from triggering more than once.
    const [googleLibraries] = useState(["places"]);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCAiDt2WyuMhekA25EMEQgx_wVO_WQW8Ok",
        libraries: googleLibraries
    });

    useEffect(() => {
        if (map) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        console.log("Current Location: ", position.coords);
                        const { latitude, longitude } = position.coords;
                        const currentUserLocation = { lat: latitude, lng: longitude };
                        map.setCenter(currentUserLocation);
                        setUserLocation(currentUserLocation);
                    },
                    error => {
                        console.error('Error getting current location:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                const defaultCenter = { lat: 48.137154, lng: 11.576124 }
                map.setCenter(defaultCenter);
            }
        }
    }, [map]);

    useEffect(() => {
        setOrdersLoaded(false);
        console.log('Fetching orders from backend...');
        const abortController = new AbortController()
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/open`,
                    {
                        credentials: "include",
                        withCredentials: true,
                        signal: abortController.signal
                    }
                );
                const data = await response.json();
                console.log('Orders:', data);
                setOrders(data);
                setOrdersLoaded(true);
                setFilteredOrders(data);
                console.log('Orders successfully fetched!');
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
        return () => {
            abortController.abort()
        }
    }, []);


    useEffect(() => {
        setDirections(null);
        setMapKey(prevKey => prevKey + 1);

        if (selectedOrder && selectedOrder.groceryShop && selectedOrder.destination?.geometry) {
            const DirectionsService = new window.google.maps.DirectionsService();
            DirectionsService.route(
                {
                    origin: userLocation,
                    destination: userLocation,
                    travelMode: 'DRIVING',
                    waypoints: [
                        {
                            location: selectedOrder.groceryShop.geometry.location,
                            stopover: true,
                        },
                        {
                            location: selectedOrder.destination.geometry.location,
                            stopover: true,
                        }

                    ]
                },
                (result, status) => {
                    if (status === 'OK') {
                        console.log('Directions:', result);
                        setDirections(result);
                        selectedOrder.directions = result.routes[0];
                        setSelectedOrder(selectedOrder)
                        console.log('Directions successfully fetched!: selectedOrder', selectedOrder);
                    }
                }
            );
        }
    }, [selectedOrder]);


    const getOpenOrders = () => {
        const abortController = new AbortController()

        const fetchOrders = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/open`,
                    {
                        credentials: "include",
                        withCredentials: true,
                        signal: abortController.signal
                    }
                );
                const data = await response.json();
                console.log('Orders:', data);
                setOrders(data);
                setFilteredOrders(data);
                console.log('Orders successfully fetched!');
                // enqueueSnackbar('Bid successfully created!', {variant: 'success'});
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders()
    }


    const handleOpenOrderDetailsModal = () => {
        setShowOrderDetailsModal(true);
    };

    const handleCloseOrderDetailsModal = () => {
        setShowOrderDetailsModal(false);
    };

    const handleOpenReviewsModal = () => {
        setShowReviewsModal(true);
    };

    const handleCloseReviewsModal = () => {
        setShowReviewsModal(false);
    };

    const handleOpenBidOnOrderModal = () => {
        setShowBidOnOrderModal(true);
    };

    const handleCloseBidOnOrderModal = () => {
        setShowBidOnOrderModal(false);
        setShowOrderDetailsModal(true);
    };

    const handleSelectOrder = () => {
        if (selectedOrder === null) {
            enqueueSnackbar('Select an order first!', { variant: 'error' });
        } else {
            handleOpenOrderDetailsModal();
        }
    }

    const handleSelection = (order) => {
        setSelectedOrder(order);
        setSelectedCustomer(order.createdBy);
    }

    return (
        <GuardCustomerType requiredType={"SHOPPER"}>{() =>
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
                    handleCloseOrderDetailsModal={handleCloseOrderDetailsModal}
                    getOpenOrders={getOpenOrders}
                />
                <ReviewsModal
                    open={showReviewsModal}
                    onClose={() => handleCloseReviewsModal()}
                    customer={selectedCustomer}
                    type={"buyer"}
                />


                <Stack direction={"column"} width={"100%"} gap={"32px"} height={"100%"}
                    justifyContent={"space-between"}>

                    {/* TODO do not hardcode the height...*/}
                    <Stack direction={{ md: "row", xs: "column" }} sx={{ "height": "100%" }} gap={"32px"}
                        maxHeight={{ "sm": "auto", "md": "70lvh" }}>

                        <Stack direction={"column"} flex={1}>
                            <Typography variant="h4" sx={{ paddingLeft: '16px', mb: 1 }}>Open Orders</Typography>
                            <OrderFilter orders={orders} setFilteredOrders={setFilteredOrders} />

                            <Divider />

                            <Show when={ordersLoaded} fallback={<ListItem sx={{ justifyContent: 'center' }}>
                                <CircularProgress sx={{ color: "primary.dark" }} />
                            </ListItem>}>

                            <List sx={{ overflow: 'auto' }}>
                                {filteredOrders.map((order) => (
                                    <OrderListItem key={order._id} order={order}
                                        handleOpenOrderDetailsModal={handleOpenOrderDetailsModal}
                                        handleOpenReviewsModal={handleOpenReviewsModal}
                                        selectedOrder={selectedOrder}
                                        setSelectedOrder={handleSelection} />
                                ))}
                            </List>
                            </Show>
                        </Stack>


                        <Stack direction={"column"} flex={2} gap={"16px"}>
                            <Show when={isLoaded} fallback={<CircularProgress sx={{ color: "primary.dark" }} />}>
                                <GoogleMap
                                    key={mapKey}
                                    mapContainerStyle={{
                                        width: '100%',
                                        height: '100%',
                                        minHeight: desktop ? undefined : "800px"
                                    }}
                                    zoom={14}
                                    onLoad={map => setMap(map)}
                                >
                                    {userLocation && (
                                        <Marker
                                            key={"userLocation"}
                                            position={userLocation}
                                            defaultAnimation={2}
                                            label={{
                                                text: "Your Location",
                                                color: 'black',
                                                fontSize: "17px",
                                                fontWeight: "bold",
                                            }}
                                        />)}


                                    {directions && ( //TODO: show travel time, choose between car and bike
                                        <>
                                            <DirectionsRenderer
                                                options={{
                                                    directions: directions,
                                                    suppressMarkers: true,
                                                    preserveViewport: false,
                                                }}
                                            />

                                            {selectedOrder.groceryShop && (<Marker
                                                key={selectedOrder.groceryShop.place_id}
                                                position={selectedOrder.groceryShop.geometry.location}
                                                label={{
                                                    text: "Shop",
                                                    color: 'black',
                                                    fontSize: "17px",
                                                    fontWeight: "bold",
                                                }}
                                            />)}

                                            {selectedOrder.destination.geometry && (<Marker
                                                key={selectedOrder.destination.place_id}
                                                position={selectedOrder.destination.geometry.location}
                                                label={{
                                                    text: "Destination",
                                                    color: 'black',
                                                    fontSize: "17px",
                                                    fontWeight: "bold",
                                                }}
                                            />)}

                                            {userLocation && (
                                                <Marker
                                                    key={"userLocation"}
                                                    position={userLocation}
                                                    defaultAnimation={2}
                                                    label={{
                                                        text: "Your Location",
                                                        color: 'black',
                                                        fontSize: "17px",
                                                        fontWeight: "bold",
                                                        background: "black",
                                                        bgcolor: "black",
                                                        className: "custom-marker-label"
                                                    }}
                                                />)}
                                        </>
                                    )}
                                </GoogleMap>
                            </Show>
                        </Stack>
                    </Stack>

                    <DarkButton onClick={() => handleSelectOrder()} alignSelf={"end"}>Select Order</DarkButton>
                </Stack>
            </>
        }</GuardCustomerType>
    )
};

export { ShopperChooseOrderView };
