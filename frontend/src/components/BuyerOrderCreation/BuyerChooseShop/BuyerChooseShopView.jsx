import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import {GoogleMap, Marker, useJsApiLoader,} from '@react-google-maps/api';
import DefineCustomShopModal from './DefineCustomShopModal';
import {Show} from "../../util/ControlFlow";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';


const BuyerChooseShopView = ({onSubmitShop}) => {

    const [selectedShop, setSelectedShop] = useState(null);
    const [map, setMap] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [searchValue, setSearchValue] = useState('Munich');
    const [shops, setShops] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [CustomShop, setCustomShop] = useState(null);

    // getDay returns 0-6, where 0 is Sunday and 6 is Saturday
    let currentDay = new Date().getDay() - 1;
    if (currentDay === -1) {
        currentDay = 6;
    }

    useEffect(() => {
        if (map) {
            const defaultCenter = {lat: 48.137154, lng: 11.576124}
            map.setCenter(defaultCenter);
            setMapCenter(defaultCenter);
        }
    }, [map]);

    // We use useState as a way of handling a constant here to stop useJsApiLoader from triggering more than once.
    const [googleLibraries] = useState(["places"]);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCAiDt2WyuMhekA25EMEQgx_wVO_WQW8Ok",
        libraries: googleLibraries
    });


    useEffect(() => {
        if (map && mapCenter) {
            console.log("Fetching shops next to location: ", mapCenter);
            const placesService = new window.google.maps.places.PlacesService(map);
            const request = {
                location: mapCenter,
                radius: 100, // Info: for low API usage radius is reduced (4000)
                type: 'grocery_or_supermarket'
            };

            placesService.nearbySearch(request, (results, status) => {
                // !!!!! for low API usage !!!!!

                // if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                //     // Fetch operating hours for each shop
                //     const shopPromises = results.map((place) => {
                //         return new Promise((resolve) => {
                //             const detailsRequest = {
                //                 placeId: place.place_id,
                //                 fields: ['opening_hours']
                //             };
                //             placesService.getDetails(detailsRequest, (placeResult, placeStatus) => {
                //                 if (placeStatus === window.google.maps.places.PlacesServiceStatus.OK) {
                //                     // Add operating hours to the place object
                //                     place.opening_hours = placeResult.opening_hours;
                //                 }
                //                 resolve(place);
                //             });
                //         });
                //     });

                //     // Wait for all promises to resolve and set the updated shops state
                //     Promise.all(shopPromises).then((updatedShops) => {
                //         setShops(updatedShops);
                //         console.log("Shop infos: ", updatedShops);
                //     });
                // }
                setShops(results);
                console.log("Fetched shops: ", results);
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

            const autocompleteService = new window.google.maps.places.AutocompleteService();
            autocompleteService.getPlacePredictions(request, (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions?.length > 0) {
                    const placeId = predictions[0].place_id;
                    placesService.getDetails({placeId}, (place, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                            map.setCenter(place.geometry.location);
                            setMapCenter(place.geometry.location);
                            console.log("Map Search Result: ", place.geometry.location);
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

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCustomShopSelect = (place) => {
        console.log("handleCustomShopSelect: ", place);
        map.setCenter(place.geometry.location);
        setMapCenter(place.geometry.location);
        setCustomShop(place);
        setSelectedShop(place);
    };

    return (
        <Box sx={{"height": "100%"}}>
            <DefineCustomShopModal
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                handleCustomShopSelect={handleCustomShopSelect}
            />

            <Grid container spacing={5}>
                <Grid item xs={6} md={4}>
                    <Typography variant={"h4"} component={"h1"}> Select a Shop</Typography>
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
                <Show when={isLoaded} fallback={<CircularProgress/>}>
                    <Grid item xs={6} md={4} sx={{maxHeight: '70vh', overflow: 'auto'}}>
                        <List>

                            <Divider sx={{mb: 2}}/>

                            <ListItem key={0}>
                                <ListItemButton variant="outlined"
                                                sx={{bgcolor: "primary.dark", borderRadius: '10px', boxShadow: 3}}
                                                onClick={() => handleOpenModal()}>
                                    <ListItemIcon sx={{justifyContent: 'left'}}>
                                        {<TravelExploreIcon/>}
                                    </ListItemIcon>
                                    <ListItemText primary="Define Custom Shop"/>
                                </ListItemButton>
                            </ListItem>

                            {CustomShop && (<ListItem key={1}>
                                <ListItemButton
                                    selected={selectedShop === CustomShop}
                                    sx={{bgcolor: "white", borderRadius: '10px', boxShadow: 3}}
                                    onClick={() => handleListEntryClick(CustomShop)}>
                                    <ListItemText primary={CustomShop.name} secondary="Your Custom Shop"/>
                                </ListItemButton>
                            </ListItem>)}

                            <Divider sx={{mt: 2, mb: 2}}/>

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
                            {selectedShop ? (
                                <Marker key={selectedShop.place_id} position={selectedShop.geometry.location}></Marker>
                            ) : CustomShop ? (
                                <Marker key={CustomShop.place_id} position={CustomShop.geometry.location}></Marker>
                            ) : null}

                        </GoogleMap>
                    </Grid>
                </Show>
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
                    <Button variant="contained" onClick={() => onSubmitShop(null)}>Skip</Button>
                    <Button variant="contained" onClick={() => onSubmitShop(selectedShop)}>Select Shop</Button>
                </Stack>
            </Box>
        </Box>
    );
};

export {BuyerChooseShopView};
