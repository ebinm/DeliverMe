import React from 'react';
import {ListItem, ListItemButton, ListItemText } from '@mui/material';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ShopListItem = ({ shop, selectedShop, handleListEntryClick, currentDay }) => {
    return (
        <ListItem key={shop.place_id}>
            <ListItemButton selected={selectedShop === shop}
                onClick={() => handleListEntryClick(shop)}
                sx={{ bgcolor: "white", borderRadius: '10px', boxShadow: 3 }}>

                <ListItemText primary={shop.name} secondary={
                    shop.opening_hours?.weekday_text?.[currentDay] || "No operating hours available"
                    
                } />


                
                <Rating name="read-only" value={shop.rating} size="small" readOnly />

            </ListItemButton>
        </ListItem>
    )
};

export { ShopListItem };