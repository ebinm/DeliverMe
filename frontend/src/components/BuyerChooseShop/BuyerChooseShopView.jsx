import React, {useEffect, useState} from 'react';
import {Box, Grid, List, ListItem, ListItemButton, ListItemText} from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import {GoogleMap, InfoWindow, LoadScript, Marker,} from '@react-google-maps/api';
import DefineCustomShopModal from './DefineCustomShopModal';


const BuyerChooseShopView = () => {
    const [map, setMap] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [searchValue, setSearchValue] = useState('Munich');
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [CustomShopValues, setCustomShopValues] = useState(null);
    const [UseCustomShop, setUseCustomShop] = useState(false);

    // getDay returns 0-6, where 0 is Sunday and 6 is Saturday
    var currentDay = new Date().getDay() - 1;
    if (currentDay === -1) {
        currentDay = 6;
    }

    useEffect(() => {
        console.log(CustomShopValues);
        console.log(UseCustomShop);
    }, [CustomShopValues, UseCustomShop]);

    useEffect(() => {
        if (map) {
            const defaultCenter = {lat: 48.137154, lng: 11.576124}
            map.setCenter(defaultCenter);
            setMapCenter(defaultCenter);
        }
    }, [map]);


    useEffect(() => {
        if (map) {
            const placesService = new window.google.maps.places.PlacesService(map);
            const request = {
                location: mapCenter,
                radius: 4000,
                type: 'grocery_or_supermarket'
            };

            placesService.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    // Fetch operating hours for each shop
                    const shopPromises = results.map((place) => {
                        return new Promise((resolve) => {
                            const detailsRequest = {
                                placeId: place.place_id,
                                fields: ['opening_hours']
                            };
                            placesService.getDetails(detailsRequest, (placeResult, placeStatus) => {
                                if (placeStatus === window.google.maps.places.PlacesServiceStatus.OK) {
                                    // Add operating hours to the place object
                                    place.opening_hours = placeResult.opening_hours;
                                }
                                resolve(place);
                            });
                        });
                    });

                    // Wait for all promises to resolve and set the updated shops state
                    Promise.all(shopPromises).then((updatedShops) => {
                        setShops(updatedShops);
                        console.log(updatedShops);
                    });
                }
            });
        }
    }, [map, mapCenter]);

    const handlePlaceSelect = () => {
        console.log('Search Value:', searchValue);

        if (map) {
            const placesService = new window.google.maps.places.PlacesService(map);

            const request = {
                input: searchValue,
                fields: ['geometry']
            };

            console.log('Search Value:', searchValue);

            const autocompleteService = new window.google.maps.places.AutocompleteService();
            autocompleteService.getPlacePredictions(request, (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions?.length > 0) {
                    const placeId = predictions[0].place_id;
                    placesService.getDetails({placeId}, (place, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                            map.setCenter(place.geometry.location);
                            setMapCenter(place.geometry.location);
                            console.log(place.geometry.location);
                        }
                    });
                }
            });
        }
    };

    const handleInputChange = (event) => {
        setSearchValue(event.target.value);
    };

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            handlePlaceSelect();
        }
    };

    const handleListEntryClick = (shop) => {
        setSelectedShop(shop);
        // map.setCenter(shop.geometry.location);
        // setMapCenter(shop.geometry.location);
    };

    const handleMarkerClick = (shop) => {
        setSelectedShop(shop);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };


    return (
        <Box sx={{ m: 10, maxHeight: "10%" }}>
            <DefineCustomShopModal
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                setUseCustomShop={setUseCustomShop}
                setCustomShopValues={setCustomShopValues}
                CustomShopValues={CustomShopValues}
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
                            defaultValue={searchValue}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                            sx={{width: '100%'}}
                        />
                        <Button variant="contained" onClick={handlePlaceSelect}>Search</Button>
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
                                                onClick={() => handleOpenModal()}>
                                    <ListItemText primary="Input Custom Shop"/>
                                </ListItemButton>
                            </ListItem>

                            {shops
                                .map(shop => (
                                    <ListItem key={shop.place_id}>
                                        <ListItemButton selected={selectedShop === shop}
                                                        onClick={() => handleListEntryClick(shop)}
                                                        sx={{bgcolor: "white", borderRadius: '10px', boxShadow: 3}}>

                                            <ListItemText primary={shop.name} secondary={
                                                shop.opening_hours?.weekday_text?.[currentDay] || "No operating hours available"
                                            }/>

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
                            {shops.map(shop => (
                                <Marker key={shop.place_id} position={shop.geometry.location}
                                        onClick={() => handleMarkerClick(shop)}>
                                    {selectedShop === shop && (
                                        <InfoWindow>
                                            <div>
                                                <h3>{shop.name}</h3>
                                            </div>
                                        </InfoWindow>
                                    )}
                                </Marker>
                            ))}
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
        </Box>
    );
};

export {BuyerChooseShopView};
