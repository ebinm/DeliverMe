import {Box, Divider, Link, Typography} from "@mui/material";
import {Show} from "../util/ControlFlow";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import {DateDisplay} from "./DateDisplay";
import {OrderItemsOverview} from "./OrderItemsOverview";
import Stack from "@mui/material/Stack";
import {useContext, useEffect, useMemo, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {ChatOverlay} from "../chat/ChatOverlay";
import Button from "@mui/material/Button";
import ChatIcon from '@mui/icons-material/Chat';
import {CustomerContext} from "../../util/context/CustomerContext";
import {DarkButton} from "../util/Buttons";
import {RatingModal} from "../util/RatingModal";

import StarsIcon from '@mui/icons-material/Stars';

export function SingleOrderViewCommon({order, contact, buttons, bidView, orderName, showDeliveryAddress = false}) {
    const iconSx = {
        "padding": "8px",
        "borderRadius": "50%",
        "backgroundColor": "primary.dark",
        "color": "white",
        "height": "1.6em",
        "width": "1.6em",
        "aspectRatio": 1
    }

    const {customer} = useContext(CustomerContext)

    const ref = useRef()
    const navigate = useNavigate()
    const params = useParams()

    const chatOpen = useMemo(() => {
        return params.id === order._id && params.action === "chat"
    }, [params.id, order._id, params.action])

    const reviewOpen = useMemo(() => {
        return params.id === order._id && params.action === "review"
    }, [params.id, order._id, params.action])

    useEffect(() => {
        // onMount
        if (params.id === order._id) {
            ref.current.scrollIntoView({behavior: "smooth"})
        }

        if (params.action !== undefined && params.id === undefined) {
            navigate(`/${customer?.type?.toLowerCase()}/my-orders/`)
        }

    }, [])


    return <Box ref={ref} boxShadow={3} borderRadius={"8px"} padding={"16px"} mt={"16px"} display={"flex"}
                flexDirection={"column"} backgroundColor={"white"}>

        <RatingModal order={order} open={reviewOpen} onClose={() => {
            navigate(`/${customer?.type?.toLowerCase()}/my-orders/`)
        }} buyer={customer?.type !== "BUYER"}/>

        <Stack direction={{sm: "row", xs: "column"}} justifyContent={"space-between"} alignItems={{
            sm: "center",
            xs: "start"
        }} gap={"16px"}>

            <Stack direction={{sm: "row", xs: "column"}} gap={{"sm": "32px", xs: "8px"}} alignItems={{
                sm: "center",
                xs: "start"
            }}>
                <Typography variant={"h5"} component={"h2"} fontWeight={"bold"}>{orderName}</Typography>
                <Box bgcolor={getStatusColor(order.status)} padding={"0 24px"} borderRadius={"8px"}>
                    <Typography component={"span"} variant={"h6"}>{order.status}</Typography>
                </Box>
            </Stack>

            <Stack gap={"8px"} display={"flex"} flexDirection={"row"} alignItems={"start"}>
                <Show
                    when={customer?.type === "BUYER" ? (order?.status === "Finished") : (order?.status === "Finished" || order?.status === "In Payment")}>{() =>
                    <Button onClick={() => navigate(`/${customer?.type?.toLowerCase()}/my-orders/${order._id}/review`)}
                            sx={{
                                "padding": "0",
                                "minWidth": 0,
                            }}>
                        <StarsIcon sx={iconSx}/>
                    </Button>
                }</Show>


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
                    <Button onClick={() => navigate(`/${customer.type.toLowerCase()}/my-orders/${order._id}/chat`)}
                            sx={{
                                "padding": "0",
                                "minWidth": 0,
                            }}>
                        <ChatIcon sx={iconSx}/>
                    </Button>
                }</Show>
            </Stack>
        </Stack>

        <Show when={order?.groceryShop}>
            <Box display={"grid"} gridTemplateColumns={"min-content auto"} gap={"8px"} mt={"16px"}>
                <ShoppingCartOutlinedIcon/>
                <Typography variant={"body1"}>{order?.groceryShop?.name}</Typography>
                <LocationOnOutlinedIcon/>
                <Typography variant={"body1"}>{order?.groceryShop?.city}, {order?.groceryShop?.street}</Typography>
            </Box>
        </Show>

        <DateDisplay from={order?.earliestDeliveryDate} to={order?.latestDeliveryDate}/>

        <Show when={showDeliveryAddress && order?.destination}>{destination =>
            <Stack direction={{md: "row", sm: "column"}}>
                <Typography variant={"body1"}>Delivery Address:&nbsp;</Typography>
                <Typography variant={"body1"}
                            color={"text.light"}>{destination.street}, {destination.city}</Typography>
            </Stack>
        }
        </Show>

        <Show when={order?.additionalNotes}>{notes =>
            <Stack direction={{md: "row", sm: "column"}}>
                <Typography variant={"body1"}>Additional Notes:&nbsp;</Typography>
                <Typography variant={"body1"}
                            color={"text.light"}>{notes}</Typography>
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
                navigate(`/${customer?.type?.toLowerCase()}/my-orders/`)
            }}/>
        }</Show>
        <Show when={order.status === "In Payment" && customer?.type?.toLowerCase() === 'buyer'} sx={{
            "padding": "0",
            "minWidth": 0,
        }}>
            <DarkButton onClick={() => navigate(`/buyer/my-orders/${order._id}/checkout`)}>
                Checkout
            </DarkButton>
        </Show>
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
