import React, {useContext, useMemo, useState} from "react";
import {Avatar, Box, IconButton, Typography} from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import AccessAlarmOutlinedIcon from "@mui/icons-material/AccessAlarmOutlined";
import Rating from "@mui/material/Rating";
import {Show} from "../util/ControlFlow";
import {CustomerContext} from "../../util/context/CustomerContext";
import {useTheme} from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import InfoIcon from "@mui/icons-material/Info";
import {ReviewsModal} from "../util/ReviewsModal";

export function SingleBidView({bid, selected = false, setSelected = () => undefined, highlightOnHover = true}) {

    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up("sm"))


    const {customer} = useContext(CustomerContext)

    const currencyFormatter = useMemo(() => Intl.NumberFormat(undefined, {
        style: "currency", currency: bid.moneyBidWithFee.currency
    }), [bid.moneyBidWithFee.currency])

    const stars = bid.createdBy.avgRating

    return <Show when={desktop}
                 fallback={() => <MobileSingleBidView customer={customer} currencyFormatter={currencyFormatter}
                                                      stars={stars} bid={bid} selected={selected}
                                                      setSelected={setSelected}/>}>{() => <DesktopSingleBidView
        customer={customer} currencyFormatter={currencyFormatter} stars={stars} bid={bid}
        selected={selected} setSelected={setSelected} highlightOnHover={highlightOnHover}/>}</Show>
}


function MobileSingleBidView({currencyFormatter, customer, stars, selected, setSelected, bid}) {

    const [showReviewsModal, setShowReviewsModal] = useState(false);

    return <Paper onClick={() => setSelected(bid._id)} sx={{
        "padding": "8px", backgroundColor: bid._id === selected ? "selected.main" : undefined
    }}>
        <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
            <Avatar imgProps={{sx: {padding: '0px'}}} alt={bid.createdBy.firstName + " " + bid.createdBy.lastName}
                    src={bid.createdBy.profilePicture}/>
            <Stack direction={"column"}>
                <Typography sx={{mt: "6px"}} variant={"h6"}
                            component={"h4"}
                            style={{"gridColumn": "span 2"}}>{bid.createdBy.firstName} {bid.createdBy.lastName}
                </Typography>

                <Stack direction={"row"}>
                    <Rating sx={{mt: "8px"}} readOnly defaultValue={stars || null} precision={0.5}/>

                    <IconButton aria-label="info" onClick={() => {
                        setShowReviewsModal(true)
                    }}>
                        <InfoIcon/>
                    </IconButton>
                </Stack>

                <Box display={"grid"} gridTemplateColumns={"min-content auto"} alignItems={"center"} columnGap={"8px"}
                     mt={"8px"}>

                    <ReviewsModal
                        open={showReviewsModal}
                        onClose={() => setShowReviewsModal(false)}
                        customer={bid.createdBy}
                        type={"shopper"}
                    />

                    <LightbulbOutlinedIcon sx={{"gridRow": "span 2"}}/>
                    <Typography sx={{color: "text.light"}}>Bid offered:</Typography>
                    <Typography>{currencyFormatter.format(customer.type === "BUYER" ? bid.moneyBidWithFee.amount : bid.moneyBid.amount)}</Typography>

                    <Show when={bid.timeBid}>
                        <AccessAlarmOutlinedIcon sx={{"gridRow": "span 2"}}/>
                        <Typography sx={{color: "text.light", "mt": "8px"}}>Delivery Time:</Typography>
                        <Typography>{new Date(bid.timeBid).toLocaleDateString()},&nbsp;{new Date(bid.timeBid).toLocaleTimeString(undefined, {timeStyle: "short"})}</Typography>
                    </Show>

                    <Show when={bid.note}>
                        <TextSnippetIcon sx={{"gridRow": "span 2"}}/>
                        <Typography sx={{color: "text.light", "mt": "8px"}}>Additional Notes:</Typography>
                        <Typography sx={{"wordBreak": "break-word"}}>{bid.note}</Typography>
                    </Show>
                </Box>
            </Stack>
        </Stack>
    </Paper>
}

function DesktopSingleBidView({currencyFormatter, customer, stars, selected, setSelected, bid, highlightOnHover}) {

    const [showReviewsModal, setShowReviewsModal] = useState(false);

    return <Box onClick={() => setSelected(bid._id)}
                margin={"8px 0"} flexGrow={1}
                display={"flex"} flexDirection={"row"}
                alignItems={"center"} gap={"16px"}
                boxShadow={2} padding={"16px"}
                borderRadius={"8px"}
                backgroundColor={bid._id === selected ? "selected.main" : undefined}
                sx={{
                    "cursor": highlightOnHover ? "pointer" : undefined, "&:hover": highlightOnHover ? {
                        "backgroundColor": bid._id === selected ? "selected.main" : "selected.light"
                    } : undefined
                }}>
        <Avatar imgProps={{sx: {padding: '0px'}}} alt={bid.createdBy.firstName + " " + bid.createdBy.lastName}
                src={bid.createdBy.profilePicture}/>
        <Box display={"flex"} flexDirection={"column"}>

            <Stack direction={"row"} flexWrap={"wrap"} gap={"10px"} sx={{mb: 2}}>
                <Typography sx={{mt: "6px"}} variant={"h6"}
                            component={"h4"}
                            style={{"gridColumn": "span 2"}}>{bid.createdBy.firstName} {bid.createdBy.lastName}
                </Typography>

                <Rating sx={{mt: "8px"}} readOnly defaultValue={stars || null} precision={0.5}/>

                <IconButton aria-label="info" onClick={() => {
                    setShowReviewsModal(true)
                }}>
                    <InfoIcon/>
                </IconButton>
            </Stack>

            <Box display={"grid"} gridTemplateColumns={"min-content auto auto"} gap={"8px"}>
                <ReviewsModal
                    open={showReviewsModal}
                    onClose={() => setShowReviewsModal(false)}
                    customer={bid.createdBy}
                    type={"shopper"}
                />

                <LightbulbOutlinedIcon/>
                <Typography mr={"64px"}>Bid offered:</Typography>
                <Typography>{currencyFormatter.format(customer.type === "BUYER" ? bid.moneyBidWithFee.amount : bid.moneyBid.amount)}</Typography>
                <Show when={bid.timeBid}>
                    <AccessAlarmOutlinedIcon/>
                    <Typography>Delivery Time:</Typography>
                    <Typography>{new Date(bid.timeBid).toLocaleDateString()},&nbsp;{new Date(bid.timeBid).toLocaleTimeString(undefined, {timeStyle: "short"})}</Typography>
                </Show>
            </Box>

            <Typography sx={{"mt": "16px", "wordBreak": "break-word"}}>{bid.note || ""}</Typography>
        </Box>
    </Box>
}