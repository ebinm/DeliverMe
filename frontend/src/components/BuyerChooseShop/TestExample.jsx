import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Marker, InfoWindow } from '@react-google-maps/api';
import { set } from 'mongoose';


const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 40.712776,
    lng: -74.005974
};

const TestExample = () => {
    const [map, setMap] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [autocomplete, setAutocomplete] = useState(null);
    const [shops, setShops] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [selectedShop, setSelectedShop] = useState(null);

    useEffect(() => {
        if (autocomplete && map) {
            const placesService = new window.google.maps.places.PlacesService(map);

            const request = {
                location: selectedPlace,
                radius: 500,
                type: 'grocery_or_supermarket'
            };

            placesService.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setShops(results);
                }
            });
        }
    }, [autocomplete, map, selectedPlace]);

    useEffect(() => {
        console.log(selectedShop);
    }, [selectedShop]);

    const handlePlaceSelect = () => {
        if (autocomplete && map) {
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
                            setSelectedPlace(place.geometry.location);
                            console.log(place.geometry.location);
                            // Additional logic with selected place information
                            console.log('Selected Place:', place);
                        }
                    });
                }
            });
        }
    };
    
    const test = () => {
        console.log("test3");
        const place = autocomplete.getPlace();
        console.log(autocomplete.getPlace());
        setSearchValue(place.formatted_address);
        handlePlaceSelect();
    }

    const handleMarkerClick = (shop) => {
        setSelectedShop(shop);
      };
      const handleInfoWindowClose = () => { //kann weg
        setSelectedShop(null);
      };

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyDtlTfWb_VyQaJfgkmuKG8qqSl0-1Cj_FQ"
            libraries={["places"]}
        >
            <div>
                <Autocomplete
                    onLoad={autocomplete => setAutocomplete(autocomplete)}
                    onPlaceChanged={test}
                >
                    <input
                        type="text"
                        placeholder="Search for a place"
                        value={searchValue}
                        onChange={e => setSearchValue(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </Autocomplete>
                <div>
                    <h2>Shops Near You:</h2>
                    <ul>
                        {shops.map(shop => (
                            <li key={shop.place_id}>{shop.name}</li>
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
                                <InfoWindow position={shop.geometry.location} onCloseClick={handleInfoWindowClose}>
                                    <div>
                                        <h3>{shop.name}ddd</h3>
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

export {TestExample};
