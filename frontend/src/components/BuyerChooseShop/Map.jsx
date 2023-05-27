import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Marker, InfoWindow, OverlayView } from '@react-google-maps/api';


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
            <div>
                <input
                    type="text"
                    placeholder="Search for a place"
                    value={searchValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                />
                <div>
                    <h2>Nearest Grocery Shops:</h2>
                    <ul>
                        {shops
                            .filter(shop => shop.types.includes('grocery_or_supermarket')) // Filter by grocery shops
                            .map(shop => (
                                <li
                                    key={shop.place_id}
                                    onClick={() => handleListEntryClick(shop)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {shop.name}
                                </li>
                            ))}
                    </ul>
                </div>
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
            </div>
        </LoadScript>
    );
};

export default MapWithSearch;