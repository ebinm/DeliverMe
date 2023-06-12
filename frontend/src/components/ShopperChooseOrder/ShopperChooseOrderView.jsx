import React, {useEffect, useState} from 'react';
import {Box, Grid, List, ListItem, ListItemButton, ListItemText} from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import {GoogleMap, LoadScript,} from '@react-google-maps/api';
import OrderDetailsModal from './OrderDetailsModal';
import BidOnOrderModal from './BidOnOrderModal';


const ShopperChooseOrderView = () => {
    const [map, setMap] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
    const [showBidOnOrderModal, setShowBidOnOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);


    useEffect(() => {
        if (map) {
            const defaultCenter = {lat: 48.137154, lng: 11.576124}
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
                    <Typography variant="h5" fontWeight="bold" sx={{mb: 4}}>
                        Select a Shop
                    </Typography>
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
                            label="Seach Location"
                            sx={{width: '100%'}}
                        />
                        <Button variant="contained">Search</Button>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container spacing={5} sx={{mb: 2}}>
                <LoadScript
                    googleMapsApiKey="AIzaSyDtlTfWb_VyQaJfgkmuKG8qqSl0-1Cj_FQ"
                    libraries={["places"]}
                >
                    <Grid item xs={6} md={4} sx={{maxHeight: '70vh', overflow: 'auto'}}>
                        <List>
                            <ListItem key={0}>
                                <ListItemButton sx={{bgcolor: "gray", borderRadius: '10px', boxShadow: 3}}
                                                onClick={() => handleOpenOrderDetailsModal()}>
                                    <ListItemText primary="Input Custom Shop"/>
                                </ListItemButton>
                            </ListItem>
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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                }}
            >
                <Stack
                    direction={{xs: 'column', sm: 'row'}}
                    divider={<Divider orientation="vertical" flexItem/>}
                    spacing={{xs: 1, sm: 1, md: 1}}
                    sx={{mb: 2}}
                >
                    <Button variant="contained">Skip</Button>
                    <Button variant="contained">Select Shop</Button>
                </Stack>
            </Box>
        </>
    );
};

export {ShopperChooseOrderView};
