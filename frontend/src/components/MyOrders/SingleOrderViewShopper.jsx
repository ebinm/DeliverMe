import { SingleOrderViewCommon } from "./SingleOrderViewCommon";
import { SingleBidView } from "./SingleBidView";
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DarkButton, OutlinedButton } from "../util/Buttons";
import Stack from "@mui/material/Stack";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RatingModal } from "../util/RatingModal";
import { For, Show } from "../util/ControlFlow"
import { CustomerContext } from "../../util/context/CustomerContext";
import ReceiptUploadModal from "./ReceiptUploadModal";
import Box from "@mui/material/Box";
import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {CurrencyInput} from "../util/CurrencyInput";
import {RatingModal} from "../util/RatingModal";
import {BaseModal} from "../util/BaseModal"
import {For, Show} from "../util/ControlFlow"
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Webcam from "react-webcam";
import CameraIcon from '@mui/icons-material/Camera';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import {CustomerContext} from "../../util/context/CustomerContext";
import {detectCost} from "../../util/ocr";
import {PUT_FETCH_OPTIONS} from "../../util/util";
import {CustomFileInput} from "../util/CustomFileUpload";

export function SingleOrderViewShopper({ order, setOrders }) {

    const { customer } = useContext(CustomerContext)

    const [uploadOpen, setUploadOpen] = useState(false)
    const [ratingOpen, setRatingOpen] = useState(false)

    return <>
        <SingleOrderViewCommon
            showDeliveryAddress
            orderName={`${order?.createdBy?.firstName} ${order?.createdBy?.lastName}`}
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
            setRatingOpen(true)
        }} />

        <RatingModal open={ratingOpen} onClose={() => setRatingOpen(false)} order={order} buyer={true} />
    </>
}
