import {Box, Divider, Link, Typography} from "@mui/material";
import {Show} from "../util/ControlFlow";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import {DateDisplay} from "./DateDisplay";
import {OrderItemsOverview} from "./OrderItemsOverview";
import Stack from "@mui/material/Stack";
import {useEffect, useRef} from "react";
import {useParams} from "react-router-dom";



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

   /*  const history = useHistory();

    const handleStatusCheckout = () => {
        if (order.status === "To be paid") {
          history.push("/components/payprovider/CheckoutPage"); // checkout path
        }
      }; */

    const ref = useRef()
    const params = useParams()
    useEffect(() => {
        // onMount
        if (params.id === order._id) {
            ref.current.scrollIntoView({behavior: "smooth"})
        }
    }, [])

    return <Box ref={ref} boxShadow={1} borderRadius={"8px"} padding={"16px"} mt={"16px"} display={"flex"}
                flexDirection={"column"} backgroundColor={"white"}>
        <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"}>

            <Box display={"flex"} flexDirection={"row"} gap={"32px"} alignItems={"center"}>
                <Typography variant={"h5"} component={"h2"} fontWeight={"bold"}>{orderName}</Typography>
                <Box bgcolor={getStatusColor(order.status)}
            padding={"0 24px"}
            borderRadius={"8px"}>
                    <Typography component={"span"} variant={"h6"}>{order.status}</Typography>
                </Box>
            </Box>

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
            </Box>
        </Box>

        <Box display={"grid"} gridTemplateColumns={"min-content auto"} gap={"8px"} mt={"16px"}>
            <ShoppingCartOutlinedIcon/>
            <Typography variant={"body1"}>{order?.groceryShop?.name}, {order?.groceryShop?.street}</Typography>
            <LocationOnOutlinedIcon/>
            <Typography variant={"body1"}>{order?.groceryShop?.city}, {order?.groceryShop?.country}</Typography>
        </Box>

        <DateDisplay from={order?.earliestDeliveryTime} to={order?.latestDeliveryTime}/>
        <Show when={showDeliveryAddress && order?.destination}>{destination =>
            <Stack direction={"row"}>
                <Typography variant={"body1"}>Delivery Address:&nbsp;</Typography>
                <Typography variant={"body1"}
                            color={"text.light"}>{destination.street}, {destination.postalCode} {destination.city}</Typography>
            </Stack>
        }
        </Show>

        <Divider sx={{"margin": "8px 0"}}/>

        <OrderItemsOverview items={order?.items} defaultExpanded={true} />

        <Divider sx={{"margin": "8px 0"}}/>


        {bidView}

        {buttons}
    </Box>
}

function getStatusColor(status) {
    switch (status) {
        case "To be paid":
            return "#DAA89B"
        case "Completed":
            return "#CBE896"
        case "Being delivered":
            return "#D8E7FF"
        case "In Progress":
            return "orange"
        default:
            return "#D8E7FF"
    }
}
