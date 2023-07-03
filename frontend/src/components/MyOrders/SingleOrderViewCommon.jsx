import React, { useState } from 'react';
import {Box, Divider, Link, Typography} from "@mui/material";
import {Show} from "../util/ControlFlow";
import { DarkButton } from '../util/Buttons';
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import {DateDisplay} from "./DateDisplay";
import {OrderItemsOverview} from "./OrderItemsOverview";
import Stack from "@mui/material/Stack";
import {useContext, useEffect, useMemo, useRef} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {ChatOverlay} from "../chat/ChatOverlay";
import Button from "@mui/material/Button";
import ChatIcon from '@mui/icons-material/Chat';
import {CustomerContext} from "../../util/context/CustomerContext";
import CheckoutPage from "../payprovider/CheckoutPage";


export function SingleOrderViewCommon({order, contact, buttons, bidView, orderName, showDeliveryAddress = false}) {
    const iconSx = {
        "padding": "8px",
        "borderRadius": "50%",
        "backgroundColor": "primary.dark",
        "color": "white",
        "height": "1.6em",
        "width": "1.6em",
        "aspectRatio": 1,
        "ml": "8px"
    }

    const {customer} = useContext(CustomerContext)

    const ref = useRef()
    const {pathname} = useLocation()
    const navigate = useNavigate()
    const params = useParams()

    const [showCheckout, setShowCheckout] = useState(false);

    const chatOpen = useMemo(() => {
        return params.id === order._id && (pathname.endsWith("/chat") || pathname.endsWith("/chat/"))
    }, [pathname, params.id, order._id])


    useEffect(() => {
        // onMount
        if (params.id === order._id && !showCheckout) {
            ref.current.scrollIntoView({behavior: "smooth"})
        }

        if (pathname.endsWith("/chat") || pathname.endsWith("/chat/")) {
            if (params.id === order._id) {
                // setChatOpen(true)
            } else if (params.id === undefined) {
                navigate(`/${customer.type.toLowerCase()}/my-orders/`)
            }
        }

        

    }, [showCheckout])


    return <Box ref={ref} boxShadow={1} borderRadius={"8px"} padding={"16px"} mt={"16px"} display={"flex"}
                flexDirection={"column"} backgroundColor={"white"}>
        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>

            <Box display={"flex"} flexDirection={"row"} gap={"32px"} alignItems={"center"}>
                <Typography variant={"h5"} component={"h2"} fontWeight={"bold"}>{orderName}</Typography>
                <Box bgcolor={getStatusColor(order.status)} padding={"0 24px"} borderRadius={"8px"}>
                    <Typography component={"span"} variant={"h6"}>{order.status}</Typography>
                </Box>
            </Box>
            <Stack direction="row" alignItems="center">
            <DarkButton onClick={() => setShowCheckout(true)}>Checkout</DarkButton>
            <Box display={"flex"} flexDirection={"row"}>
                <Show when={contact?.phoneNumber}>{phoneNumber =>
                    <Link href={`tel:${phoneNumber}`}>
                        <PhoneIcon sx={iconSx}/>
                    </Link>
                }</Show>

                <Show when={contact?.email}>{email =>
                    <Link href={`mailto:${email}`}>
                        <EmailIcon sx={iconSx}/>
                    </Link>
                }</Show>

                <Show when={order?.selectedBid?.createdBy}>{() =>
                    <Button onClick={() => navigate(`./${order._id}/chat`)}>
                        <ChatIcon sx={iconSx}/>
                    </Button>
                }</Show>

            </Box>
            </Stack>

            {showCheckout && (
                <CheckoutPage
                    order={order} 
                />
             )}

        </Box>

        <Show when={order?.groceryShop}>
            <Box display={"grid"} gridTemplateColumns={"min-content auto"} gap={"8px"} mt={"16px"}>
                <ShoppingCartOutlinedIcon/>
                <Typography variant={"body1"}>{order?.groceryShop?.name}</Typography>
                <LocationOnOutlinedIcon/>
                <Typography variant={"body1"}>{order?.groceryShop?.city}, {order?.groceryShop?.street}</Typography>
            </Box>
        </Show>

        <DateDisplay from={order?.earliestDeliveryTime} to={order?.latestDeliveryTime}/>
        <Show when={showDeliveryAddress && order?.destination}>{destination =>
            <Stack direction={"row"}>
                <Typography variant={"body1"}>Delivery Address:&nbsp;</Typography>
                <Typography variant={"body1"}
                            color={"text.light"}>{destination.street}, {destination.city}</Typography>
            </Stack>
        }
        </Show>

        <Divider sx={{"margin": "8px 0"}}/>

        <OrderItemsOverview items={order?.items} defaultExpanded={true}/>

        <Divider sx={{"margin": "8px 0"}}/>

        {bidView}

        {buttons}

        <Show when={order?.selectedBid?.createdBy}>{() =>
            <ChatOverlay order={order} open={chatOpen} onClose={() => {
                navigate(`/${customer.type.toLowerCase()}/my-orders/`)
            }}/>
        }</Show>
    </Box>
}

function getStatusColor(status) {
    switch (status) {
        case "Open":
            return "#D8E7FF"
        case "In Delivery":
            return "#D8E7FF"
        case "In Payment":
            return "orange"
        case "Finished":
            return "#CBE896"
    }

    return "#DAA89B"
}
