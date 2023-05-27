import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Grid } from '@mui/material';
import { ListItemButton } from '@mui/material';
import { FixedSizeList } from 'react-window';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { GoogleMap, LoadScript, Autocomplete, Marker, InfoWindow, OverlayView } from '@react-google-maps/api';



const MapWithList = () => {
    const [inputValue, setInputValue] = React.useState('');

    const containerStyle = {
        width: '100%',
        height: '400px'
    };

    const center = {
        lat: 48.137154,
        lng: 11.576124
    };

    const MapWithSearch = () => {
        const [map, setMap] = useState(null);
        const [searchValue, setSearchValue] = useState('');
        const [shops, setShops] = useState([]);
        const [selectedShop, setSelectedShop] = useState(null);
        const [mapCenter, setMapCenter] = useState(null);

        useEffect(() => {
            if (map) {
                const placesService = new window.google.maps.places.PlacesService(map);

                const request = {
                    location: mapCenter ? mapCenter : center,
                    radius: 1000,
                    type: 'grocery_or_supermarket'
                };

                placesService.nearbySearch(request, (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        setShops(results);
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
                                console.log(place.geometry.location);
                                // Additional logic with selected place information
                                console.log('Selected Place:', place);
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
            map.setCenter(shop.geometry.location);
            setMapCenter(shop.geometry.location);
        };


        const handleMarkerClick = (shop) => {
            setSelectedShop(shop);
        };


        return (
            <LoadScript
            googleMapsApiKey="AIzaSyDtlTfWb_VyQaJfgkmuKG8qqSl0-1Cj_FQ"
            libraries={["places"]}
        >
            <>
                <Grid container spacing={5}>
                    <Grid item xs={6} md={4}>
                        <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
                            Select a Shop
                        </Typography>

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
                                defaultValue={searchValue}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyDown}
                                sx={{ width: '100%' }}
                            />
                            <Button variant="contained">Seach</Button>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid container spacing={5} sx={{ mb: 4 }}>

                        <Grid item xs={6} md={4}>
                            <List sx={{ maxHeight: "100%", maxWidth: "100%", overflow: 'auto', }}>

                                {shops
                                    .filter(shop => shop.types.includes('grocery_or_supermarket')) // Filter by grocery shops
                                    .map(shop => (
                                        <ListItem key={shop.place_id} onClick={() => handleListEntryClick(shop)} sx={{ bgcolor: "white", mb: 1, borderRadius: '10px', boxShadow: 3 }}>
                                            <ListItemButton>
                                                <ListItemText primary={shop.name} secondary="Jan 7, 2014. When is Ebins next rap concert?" />

                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                            </List>

                        </Grid>
                        <Grid item xs={6} md={8}>
                            <Box sx={{ height: '100%', width: '100%' }}>
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={center}
                                    zoom={14}
                                    onLoad={map => setMap(map)}
                                >
                                    {shops.map(shop => (
                                        <Marker key={shop.place_id} position={shop.geometry.location} onClick={() => handleMarkerClick(shop)}>
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
                            </Box>
                        </Grid>

                </Grid>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row-reverse',
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={{ xs: 1, sm: 1, md: 1 }}
                        sx={{ mb: 2 }}
                    >
                        <Button variant="contained">Skip</Button>
                        <Button variant="contained">Select Shop</Button>
                    </Stack>
                </Box>
            </>
            </LoadScript>

        );
    };
}

export default MapWithList;
