import React from 'react';
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

import Map from "./Map";



const MapWithList = () => {

    // Sample list of string entries
    const listData = ['Entry 1', 'Entry 2', 'Entry 3', 'Entry 4', 'Entry 5', 'Entry 4', 'Entry 5', 'Entry 4'];

    return (
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
                            defaultValue="Munich"
                            sx={{ width: '100%' }}
                        />
                        <Button variant="contained">Seach</Button>
                    </Stack>      
                </Grid>
            </Grid>
            <Grid container spacing={5} sx={{ mb: 4 }}>
                <Grid item xs={6} md={4}>
                    <List sx={{ maxHeight: "100%", maxWidth: "100%", overflow: 'auto', }}>
                        {listData.map((item, index) => (
                            <ListItem key={index} sx={{ bgcolor: "white", mb: 1, borderRadius: '10px', boxShadow: 3 }}>
                                <ListItemButton>
                                    <ListItemText primary={item} secondary="Jan 7, 2014. When is Ebins next rap concert?"/>

                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                </Grid>
                <Grid item xs={6} md={8}>      
                    <Box sx={{ height: '100%', width: '100%' }}>
                        <Map/>
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

    );
};

export default MapWithList;
