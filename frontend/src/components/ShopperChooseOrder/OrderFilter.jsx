import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import FilterListIcon from '@mui/icons-material/FilterList';


const OrderFilter = ({ orders, setFilteredOrders, directions }) => {
    const [ascendingItems, setAscendingItems] = useState(false);
    const [ascendingStars, setAscendingStars] = useState(false);
    const [nearBy, setNearBy] = useState(false);
    const [cityName, setCityName] = useState();

    useEffect(() => {
        setAscendingItemsSearch();
    }, [])

    useEffect(() => {
        // Perform filtering when any of the filter values change
        let filtered = [...orders];

        // Filter by city name in shop and destination
        if (cityName && cityName.length > 0) {
            filtered = filtered.filter((order) =>
                order.destination.city.toLowerCase().includes(cityName.toLowerCase()) ||
                order.groceryShop?.city.toLowerCase().includes(cityName.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            if (ascendingItems) {
                return b.items.length - a.items.length;
            } else if (nearBy) {
                if (a.directions != null && b.directions != null) {
                    return a.directions.routes[0].legs[0].distance.value - b.directions.routes[0].legs[0].distance.value;
                } else if (b.directions != null) {
                    return 1 - b.directions.routes[0].legs[0].distance.value;
                } else if (a.directions != null) {
                    return a.directions.routes[0].legs[0].distance.value - 1;
                } else {
                    return 0;
                }
            } else {
                if (a.createdBy.avgRating == null) {
                    a.createdBy.avgRating = 0;
                }
                if (b.createdBy.avgRating == null) {
                    b.createdBy.avgRating = 0;
                }
                return b.createdBy.avgRating - a.createdBy.avgRating;
            }
        });

        setFilteredOrders(filtered);
    }, [orders, ascendingItems, ascendingStars, cityName, setFilteredOrders]);


    const setNearBySearch = () => {
        setNearBy(true);
        setAscendingItems(false);
        setAscendingStars(false);
    }

    const setAscendingItemsSearch = () => {
        setNearBy(false);
        setAscendingItems(true);
        setAscendingStars(false);
    }

    const setAscendingStarsSearch = () => {
        setNearBy(false);
        setAscendingItems(false);
        setAscendingStars(true);
    }

    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            divider={<Divider orientation="vertical" flexItem />}
            spacing={{ xs: 1, sm: 1, md: 1 }}
            sx={{ paddingLeft: '16px', mb: 2 }}

        >
            <TextField
                id="location"
                label="Filter by city name"
                sx={{ width: '100%' }}
                onChange={(event) => {
                    setCityName(event.target.value);
                }}
                value={cityName}
            />

            <Button sx={{ color: "gray" }} startIcon={(nearBy) ? (<FilterListIcon />) : (<FilterListOffIcon />)} onClick={() => {setNearBySearch()}}>
                Near By
            </Button>

            <Button sx={{ color: "gray" }} startIcon={(ascendingItems) ? (<FilterListIcon />) : (<FilterListOffIcon />)} onClick={() => { setAscendingItemsSearch() }}>
                Number Items
            </Button>

            <Button sx={{ color: "gray" }} startIcon={(ascendingStars) ? (<FilterListIcon />) : (<FilterListOffIcon />)} onClick={() => { setAscendingStarsSearch() }}>
                User Rating
            </Button>

        </Stack>
    )


}

export { OrderFilter };