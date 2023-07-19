import React, { useEffect, useState } from 'react';
import { Box, IconButton, ListItem, ListItemAvatar, ListItemButton, CircularProgress } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Show } from '../util/ControlFlow';
import Divider from '@mui/material/Divider';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import MopedOutlinedIcon from '@mui/icons-material/MopedOutlined';
import Rating from "@mui/material/Rating";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from "@mui/system";


const TravelPlaner = ({ order, userLocation, orderDirectionsLoaded }) => {

    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up("md"))


    return (
        <Box>
            <Typography variant={"body1"}><b>Travel Planer:</b></Typography>

            <Show when={desktop}>
                <Show when={userLocation} fallback={<Typography sx={{ ml: 1, minWidth: "475px" }} variant={"body1"}>Activate location tracking to use this feature!</Typography>}>
                    <Show when={orderDirectionsLoaded} fallback={<Typography sx={{ ml: 1, minWidth: "475px" }} variant={"body1"}><CircularProgress sx={{ color: "primary.dark" }} /></Typography>}>
                        <Show when={order?.directions != null} fallback={<Typography sx={{ ml: 1, minWidth: "475px" }} variant={"body1"}>No shop specified!</Typography>}>
                            <Box sx={{ ml: 1 }} display={"grid"} gridTemplateColumns={"max-content max-content max-content max-content max-content"} columnGap={1}>
                                <Typography variant={"body1"}>Current Location</Typography>
                                <Typography variant={"body1"}>-{'>'}</Typography>
                                <Typography variant={"body1"}>Shop</Typography>
                                <Typography variant={"body1"}>= {order?.directions?.routes[0]?.legs[0].distance.text}</Typography>
                                <Typography variant={"body1"}>| {order?.directions?.routes[0]?.legs[0].duration.text}</Typography>

                                <Typography variant={"body1"}>Shop</Typography>
                                <Typography variant={"body1"}>-{'>'}</Typography>
                                <Typography variant={"body1"}>Customer</Typography>
                                <Typography variant={"body1"}>= {order?.directions?.routes[0]?.legs[1].distance.text}</Typography>
                                <Typography variant={"body1"}>| {order?.directions?.routes[0]?.legs[1].duration.text}</Typography>

                                <Typography variant={"body1"}>Customer</Typography>
                                <Typography variant={"body1"}>-{'>'}</Typography>
                                <Typography variant={"body1"}>Current Location</Typography>
                                <Typography variant={"body1"}>= {order?.directions?.routes[0]?.legs[2].distance.text}</Typography>
                                <Typography variant={"body1"}>| {order?.directions?.routes[0]?.legs[2].duration.text}</Typography>
                            </Box>
                        </Show>
                    </Show>
                </Show>
            </Show>

            <Show when={!desktop}>
                <Show when={userLocation} fallback={<Typography sx={{ ml: 1 }} variant={"body1"}>Activate location tracking to use this feature!</Typography>}>
                    <Show when={orderDirectionsLoaded} fallback={<Typography sx={{ ml: 1 }} variant={"body1"}><CircularProgress sx={{ color: "primary.dark" }} /></Typography>}>
                        <Show when={order?.directions != null} fallback={<Typography sx={{ ml: 1 }} variant={"body1"}>No shop specified!</Typography>}>
                            <Stack sx={{ ml: 1 }} direction="column" flexWrap="wrap">
                                <Stack direction="row">
                                    <Typography
                                        variant={"body1"}> Current Location -&gt; Shop =  {order?.directions?.routes[0]?.legs[0].distance.text} | {order?.directions?.routes[0]?.legs[0].duration.text}
                                    </Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Typography
                                        variant={"body1"}> Shop -&gt; Customer =  {order?.directions?.routes[0]?.legs[1].distance.text} | {order?.directions?.routes[0]?.legs[1].duration.text}
                                    </Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Typography
                                        variant={"body1"}> Customer -&gt; Current Location =  {order?.directions?.routes[0]?.legs[2].distance.text} | {order?.directions?.routes[0]?.legs[2].duration.text}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Show>
                    </Show>
                </Show>
            </Show>
        </Box>
    )
};

export { TravelPlaner };