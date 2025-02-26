import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { GoogleMap, Marker, useJsApiLoader, InfoWindowF } from '@react-google-maps/api';
import DefineCustomShopModal from './DefineCustomShopModal';
import { Show } from "../../util/ControlFlow";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { ShopListItem } from './ShopListItem';
import { DarkButton, OutlinedButton } from "../../util/Buttons";
import { useTheme } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";

const BuyerChooseShopView = ({ onSubmitShop, setSelectedShop, selectedShop }) => {

    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up("md"))

    const [map, setMap] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [shops, setShops] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [CustomShop, setCustomShop] = useState(null);
    const [userLocation, setUserLocation] = useState(false);
    const [searchLocation, setSearchLocation] = useState(false);
    const [shopsloaded, setShopsLoaded] = useState(false);

    // getDay returns 0-6, where 0 is Sunday and 6 is Saturday
    let currentDay = new Date().getDay() - 1;
    if (currentDay === -1) {
        currentDay = 6;
    }

    useEffect(() => {
        setSearchLocation(false);
        const defaultCenter = { lat: 48.137154, lng: 11.576124 }
        if (map) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        console.log("Current Location: ", position.coords);
                        const { latitude, longitude } = position.coords;
                        const currentUserLocation = { lat: latitude, lng: longitude };
                        map.setCenter(currentUserLocation);
                        setMapCenter(currentUserLocation);
                        setUserLocation(currentUserLocation)
                    },
                    error => {
                        console.error('Error getting current location:', error);
                        map.setCenter(defaultCenter);
                        setMapCenter(defaultCenter);
                        setSearchLocation(defaultCenter);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                map.setCenter(defaultCenter);
                setMapCenter(defaultCenter);
                setSearchLocation(defaultCenter);
            }
        }
    }, [map]);

    // We use useState as a way of handling a constant here to stop useJsApiLoader from triggering more than once.
    const [googleLibraries] = useState(["places"]);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyCAiDt2WyuMhekA25EMEQgx_wVO_WQW8Ok",
        libraries: googleLibraries
    });


    useEffect(() => {
        setShopsLoaded(false);
        if (map && mapCenter) {
            console.log("Fetching shops next to location: ", mapCenter);
            const placesService = new window.google.maps.places.PlacesService(map);
            const request = {
                location: mapCenter,
                radius: 4000,
                type: 'grocery_or_supermarket'
            };

            placesService.nearbySearch(request, (results, status) => {
                setShops(results);
                console.log("Successfully Fetched Shops: ", results);

                if (results !== [] && status === window.google.maps.places.PlacesServiceStatus.OK) {
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
                        setShopsLoaded(true);
                        console.log("Successfully Fetched opening hours: ", updatedShops);
                    });
                } else {
                    setShopsLoaded(true);
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

            const autocompleteService = new window.google.maps.places.AutocompleteService();
            autocompleteService.getPlacePredictions(request, (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions?.length > 0) {
                    const placeId = predictions[0].place_id;
                    placesService.getDetails({ placeId }, (place, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                            map.setCenter(place.geometry.location);
                            setMapCenter(place.geometry.location);
                            setSearchLocation(place.geometry.location);
                            setUserLocation(false)
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
        const [street, city] = shop.vicinity.split(', ');
        shop.city = city;
        shop.street = street;
        setSelectedShop(shop);
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

    // Yes, these are a lot of nested stacks, but it makes creating a responsive design easier
    return (
        <Stack direction={"column"} width={"100%"} gap={"32px"} height={"100%"}
            justifyContent={"space-between"}>

            {/* TODO do not hardcode the height...*/}
            <Stack direction={{ md: "row", xs: "column" }} sx={{ "height": "100%" }} gap={"32px"} maxHeight={{ "sm": "60", "md": "70lvh" }}>
                <DefineCustomShopModal
                    showModal={showModal}
                    handleCloseModal={handleCloseModal}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    handleCustomShopSelect={handleCustomShopSelect}
                />

                <Stack direction={"column"} flex={1}>
                    <Typography variant={"h4"} component={"h1"}> Select a Shop</Typography>
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            <Divider sx={{ mb: 2 }} />
                            <ListItem key={0}>
                                <ListItemButton variant="outlined"
                                    sx={{ bgcolor: "primary.dark", borderRadius: '10px', boxShadow: 3 }}
                                    onClick={() => handleOpenModal()}>
                                    <ListItemIcon sx={{ justifyContent: 'left' }}>
                                        {<TravelExploreIcon />}
                                    </ListItemIcon>
                                    <ListItemText
                                        disableTypography
                                        primary={<Typography style={{
                                            color: '#FFFFFF',
                                            fontFamily: 'Roboto',
                                            textTransform: 'uppercase'
                                        }}>
                                            Define Custom Shop
                                        </Typography>}
                                    />
                                </ListItemButton>
                            </ListItem>

                            {CustomShop &&
                                (<ListItem key={1}>
                                    <ListItemButton
                                        selected={selectedShop === CustomShop}
                                        sx={{ bgcolor: "white", borderRadius: '10px', boxShadow: 3 }}
                                        onClick={() => handleListEntryClick(CustomShop)}>
                                        <ListItemText primary={CustomShop.name} secondary="Your Custom Shop" />
                                    </ListItemButton>
                                </ListItem>)}

                            <Divider sx={{ mt: 2, mb: 2 }} />

                            <Show when={shopsloaded} fallback={<ListItem sx={{ justifyContent: 'center' }}>
                                <CircularProgress sx={{ color: "primary.dark" }} />
                            </ListItem>}>
                                {shops
                                    .map(shop => (
                                        <ShopListItem key={shop.place_id} shop={shop} selectedShop={selectedShop}
                                            currentDay={currentDay}
                                            handleListEntryClick={handleListEntryClick} />
                                    ))}
                            </Show>
                        </List>
                    </Box>
                </Stack>

                <Stack direction={"column"} flex={2} gap={"16px"}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        divider={<Divider orientation="vertical" flexItem />}
                    >
                        <TextField
                            id="location"
                            label="Search Location"
                            defaultValue={searchValue}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                            sx={{ width: '100%' }}
                        />
                        <DarkButton sx={{ "alignSelf": "stretch", "minWidth": "" }}
                            onClick={handlePlaceSelect}>Search</DarkButton>
                    </Stack>


                    <Show when={isLoaded} fallback={<CircularProgress sx={{ color: "primary.dark" }} />}>
                        <GoogleMap
                            mapContainerStyle={{
                                width: '100%',
                                height: '100%',
                                minHeight: desktop ? undefined : "800px"
                            }}
                            zoom={14}
                            onLoad={map => setMap(map)}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                        >

                            {selectedShop ? (
                                <Marker
                                    key={selectedShop.place_id}
                                    position={selectedShop.geometry.location}
                                    defaultAnimation={2}
                                    label={{
                                        text: "Shop",
                                        color: 'black',
                                        fontSize: "17px",
                                        fontWeight: "bold",
                                        zIndex: 100,
                                        backgroundColor: "#7fffd4"
                                    }} />
                            ) : CustomShop ? (
                                <Marker
                                    key={CustomShop.place_id}
                                    position={CustomShop.geometry.location}
                                    defaultAnimation={2}
                                    label={{
                                        text: "Shop",
                                        color: 'black',
                                        fontSize: "17px",
                                        fontWeight: "bold",
                                        zIndex: 100,
                                        backgroundColor: "#7fffd4"
                                    }} />
                            ) : null}

                            {userLocation && (
                                <><Marker
                                    key={"userLocation"}
                                    position={userLocation}
                                    defaultAnimation={2}
                                    label={{
                                        text: "Your Location",
                                        color: 'black',
                                        fontSize: "17px",
                                        fontWeight: "bold",
                                        zIndex: 100,
                                        backgroundColor: "#7fffd4"
                                    }}
                                />
                                </>)}
                            {searchLocation && (<Marker
                                key={"searchLocation"}
                                position={searchLocation}
                                label={{
                                    text: "Search Location",
                                    color: 'black',
                                    fontSize: "17px",
                                    fontWeight: "bold",
                                    zIndex: 100,
                                    backgroundColor: "#7fffd4"
                                }}
                            />)}

                        </GoogleMap>
                    </Show>
                </Stack>


            </Stack>

            <Stack
                direction={"row"}
                alignSelf={"end"}
                flexWrap={"wrap"}
                gap={"8px"}
            >
                <OutlinedButton onClick={() => onSubmitShop(null)}>Skip</OutlinedButton>
                <DarkButton onClick={() => onSubmitShop(selectedShop)}>Select Shop</DarkButton>
            </Stack>
        </Stack>
    );
};

export { BuyerChooseShopView };
