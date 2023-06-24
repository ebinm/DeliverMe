import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import FilterListIcon from '@mui/icons-material/FilterList';



const OrderFilter = ({ orders, setFilteredOrders }) => {
    const [ascendingItems, setAscendingItems] = useState(true);
    const [ascendingStars, setAscendingStars] = useState(false);
    const [cityName, setCityName] = useState();

    useEffect(() => {
        // Perform filtering when any of the filter values change
        let filtered = [...orders];

        // Filter by city name in shop and destination
        if (cityName && cityName.length > 0) {
            filtered = filtered.filter((order) =>
                order.destination.city.toLowerCase().includes(cityName.toLowerCase()) ||
                order.groceryShop.city.toLowerCase().includes(cityName.toLowerCase())
            );
        } 

        // TODO add rating
        // Sort by number of items
        filtered.sort((a, b) => {
            if (ascendingItems) {
                return a.items.length - b.items.length;
            } else {
                // descending order
                return b.items.length - a.items.length;
            }
        });

        setFilteredOrders(filtered);
    }, [orders, ascendingItems, ascendingStars, cityName, setFilteredOrders]);


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

            <Button sx={{ color: "gray" }} startIcon={(ascendingItems) ? (<FilterListOffIcon />) : (<FilterListIcon />)} onClick={() => { setAscendingItems(!ascendingItems); setAscendingStars(!ascendingStars) }}>
                Number Items
            </Button>

            <Button sx={{ color: "gray" }} startIcon={(ascendingStars) ? (<FilterListOffIcon />) : (<FilterListIcon />)} onClick={() => { setAscendingStars(!ascendingStars); setAscendingItems(!ascendingItems) }}>
                todo
            </Button>

        </Stack>
    )


}

export { OrderFilter };