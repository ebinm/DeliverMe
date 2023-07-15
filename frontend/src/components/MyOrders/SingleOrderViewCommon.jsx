import {Box, CircularProgress, Divider, Link, Typography} from "@mui/material";
import {Show} from "../util/ControlFlow";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import {DateDisplay} from "./DateDisplay";
import {OrderItemsOverview} from "./OrderItemsOverview";
import Stack from "@mui/material/Stack";
import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {ChatOverlay} from "../chat/ChatOverlay";
import Button from "@mui/material/Button";
import ChatIcon from '@mui/icons-material/Chat';
import {CustomerContext} from "../../util/context/CustomerContext";
import {DarkButton, OutlinedButton} from "../util/Buttons";
import {RatingModal} from "../util/RatingModal";
import {HelperText, HoverPopper} from "../util/HoverPopper";
import {BaseModal} from "../util/BaseModal";
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';

/**
 * A base component for both the buyers and the shoppers order view
 *
 * @param order The order.
 * @param contact The person to be listed as contact (the shopper for the buyer view and vice versa)
 * @param buttons The buttons at the bottom of the view.
 * @param bidView The view showing the bids.
 * @param orderName The name of the order.
 * @param showDeliveryAddress A boolean indicating of the deliveryAddress should be shown.
 * @param deleteSelf An optional function for deleting the order.
 * @returns {JSX.Element}
 * @constructor
 */
export function SingleOrderViewCommon({
                                          order,
                                          contact,
                                          buttons,
                                          bidView,
                                          orderName,
                                          showDeliveryAddress = false,
                                          deleteSelf
                                      }) {
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

    const deleteOpen = useMemo(() => {
        return params.id === order._id && params.action === "delete"
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

        <DeletionModal open={deleteOpen && deleteSelf} deleteOrder={deleteSelf} onClose={() => {
            navigate(`/${customer?.type?.toLowerCase()}/my-orders/`)
        }} orderName={orderName}/>

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

                    <HoverPopper delay={"1000ms"} overlay={
                        <HelperText>Rate {contact?.firstName} {contact?.lastName}</HelperText>}>
                        <Button
                            onClick={() => navigate(`/${customer?.type?.toLowerCase()}/my-orders/${order._id}/review`)}
                            sx={{
                                "padding": "0",
                                "minWidth": 0,
                            }}>
                            <StarIcon sx={iconSx}/>
                        </Button>
                    </HoverPopper>
                }</Show>


                <Show when={contact?.phoneNumber}>{phoneNumber =>
                    <HoverPopper delay={"1000ms"} overlay={
                        <HelperText>Call {contact?.firstName} {contact?.lastName}</HelperText>}>
                        <Link href={`tel:${phoneNumber}`}>
                            <PhoneIcon sx={iconSx}/>
                        </Link>
                    </HoverPopper>
                }</Show>

                <Show when={contact?.email}>{email =>
                    <HoverPopper delay={"1000ms"} overlay={<HelperText>Send an email
                        to {contact?.firstName} {contact?.lastName}</HelperText>}>
                        <Link href={`mailto:${email}`}>
                            <EmailIcon sx={iconSx}/>
                        </Link>
                    </HoverPopper>
                }</Show>

                <Show when={order?.selectedBid?.createdBy}>{() =>
                    <HoverPopper delay={"1000ms"} overlay={<HelperText>Open chat</HelperText>}>
                        <Button
                            onClick={() => navigate(`/${customer?.type?.toLowerCase()}/my-orders/${order._id}/chat`)}
                            sx={{
                                "padding": "0",
                                "minWidth": 0,
                            }}>
                            <ChatIcon sx={iconSx}/>
                        </Button>
                    </HoverPopper>
                }</Show>


                <Show when={deleteSelf && customer?.type === "BUYER" && !order?.selectedBid}>{() =>
                    <HoverPopper delay={"1000ms"} overlay={<HelperText>Delete this order</HelperText>}>
                        <Button
                            onClick={() => navigate(`/${customer?.type?.toLowerCase()}/my-orders/${order._id}/delete`)}
                            sx={{
                                "padding": "0",
                                "minWidth": 0,
                            }}>
                            <DeleteIcon sx={iconSx}/>
                        </Button>
                    </HoverPopper>
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

function DeletionModal({open, deleteOrder, orderName, onClose}) {
    const [loading, setLoading] = useState(false)
    return <BaseModal open={open} title={"Are you sure you want to delete this order?"}>
        <Typography>This will permanently delete {orderName}</Typography>
        <Stack direction={{"xs": "column", "sm": "row"}} width={"100%"} justifyContent={"flex-end"} gap={"16px"}>
            <OutlinedButton onClick={onClose}>Cancel</OutlinedButton>
            <DarkButton onClick={async () => {
                setLoading(true)
                await deleteOrder()
                setLoading(false)
                onClose()
            }}>
                <Show when={!loading} fallback={<CircularProgress size={"1.5rem"}/>}>
                    Delete
                </Show>


            </DarkButton>
        </Stack>
    </BaseModal>

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
