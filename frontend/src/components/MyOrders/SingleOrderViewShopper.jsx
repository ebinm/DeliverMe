import {SingleOrderViewCommon} from "./SingleOrderViewCommon";
import {SingleBidView} from "./SingleBidView";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {DarkButton} from "../util/Buttons";
import Stack from "@mui/material/Stack";
import React, {useContext, useState} from "react";
import {For, Show} from "../util/ControlFlow"
import {CustomerContext} from "../../util/context/CustomerContext";
import ReceiptUploadModal from "./ReceiptUploadModal";
import Avatar from "@mui/material/Avatar";
import {useNavigate} from "react-router-dom";

export function SingleOrderViewShopper({ order, setOrders }) {

    const { customer } = useContext(CustomerContext)

    const navigate = useNavigate()
    const [uploadOpen, setUploadOpen] = useState(false)

    return <>
        <SingleOrderViewCommon
            showDeliveryAddress
            orderName={<Stack direction={"row"} alignItems={"center"} gap={"8px"}><Avatar sx={{"display": {"sm": "inherit", "xs": "none"}}}  src={order?.createdBy?.profilePicture}/>{order?.createdBy?.firstName} {order?.createdBy?.lastName}</Stack>}
            order={order}
            contact={order.createdBy}
            bidView={
                <Accordion defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography color={"text.light"} variant={"h6"} component={"h3"}>My
                            bid{order.selectedBid ? " (selected)" : ""}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Show when={order.selectedBid} fallback={
                            <For each={order.bids}
                                fallback={<Typography color={"text.light"}>No bids placed</Typography>}>{bid =>
                                    <SingleBidView key={bid._id} bid={bid} highlightOnHover={false} />
                                }</For>
                        }>{bid =>
                            <SingleBidView bid={bid} highlightOnHover={false} />
                            }</Show>
                    </AccordionDetails>
                </Accordion>
            }
            buttons={
                <Stack mt={"16px"}>
                    <Show when={order?.status === "In Delivery" && order?.selectedBid?.createdBy._id === customer._id}>
                        <DarkButton onClick={() => setUploadOpen(true)}>Upload Receipt</DarkButton>
                    </Show>
                </Stack>

            }
        />

        <ReceiptUploadModal orderId={order?._id} open={uploadOpen} onClose={() => {
            setUploadOpen(false)
        }} onSuccess={() => {
            // setOrders may be undefined for example in the order selection screen.
            setOrders && setOrders(orders => orders.map(it => it !== order ? it : { ...it, status: "In Payment" }))
            setUploadOpen(false)
            navigate(`/shopper/my-orders/${order?._id}/review`)
        }} />
</>
}
