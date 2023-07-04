import React, {useEffect, useState} from 'react';
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

        filtered.sort((a, b) => {
            if (ascendingItems) {
                return b.items.length - a.items.length;
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

            <Button sx={{ color: "gray" }} startIcon={(ascendingItems) ? (<FilterListIcon />) : (<FilterListOffIcon />)} onClick={() => { setAscendingItems(!ascendingItems); setAscendingStars(!ascendingStars) }}>
                Number Items
            </Button>

            <Button sx={{ color: "gray" }} startIcon={(ascendingStars) ? (<FilterListIcon />) : (<FilterListOffIcon />)} onClick={() => { setAscendingStars(!ascendingStars); setAscendingItems(!ascendingItems) }}>
                User Rating 
            </Button>

        </Stack>
    )


}

export { OrderFilter };