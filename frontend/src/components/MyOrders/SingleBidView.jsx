import {useMemo} from "react";
import {Avatar, Box, Typography} from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import AccessAlarmOutlinedIcon from "@mui/icons-material/AccessAlarmOutlined";
import Rating from "@mui/material/Rating";
import {Show} from "../util/ControlFlow";

export function SingleBidView({bid, selected = false, setSelected = () => undefined, highlightOnHover = true}) {

    const currencyFormatter = useMemo(() => Intl.NumberFormat(undefined, {
        style: "currency",
        currency: bid.moneyBidWithFee.currency
    }), [bid.moneyBidWithFee.currency])

    const stars = Math.min(5, Math.floor(bid.createdBy.ratingStarAverage))

    return <Box onClick={() => setSelected(bid._id)}
                margin={"8px 0"} flexGrow={1}
                display={"flex"} flexDirection={"row"}
                alignItems={"center"} gap={"16px"}
                boxShadow={1} padding={"16px"}
                borderRadius={"8px"}
                backgroundColor={bid._id === selected ? "selected.main" : undefined}
                sx={{
                    "cursor": highlightOnHover ? "pointer" : undefined,
                    "&:hover": highlightOnHover ? {
                        "backgroundColor": bid._id === selected ? "selected.main" : "selected.light"
                    } : undefined
                }}>
        <Avatar/>
        <Box display={"flex"} flexDirection={"column"}>
            <Box display={"grid"} gridTemplateColumns={"min-content auto auto"} gap={"8px"}>
                <Typography variant={"h6"}
                            component={"h4"}
                            style={{"gridColumn": "span 2"}}>{bid.createdBy.firstName} {bid.createdBy.lastName}</Typography>

                <Rating readOnly defaultValue={stars || null}/>

                <LightbulbOutlinedIcon/>
                <Typography mr={"64px"}>Bid offered:</Typography>
                <Typography>{currencyFormatter.format(bid.moneyBidWithFee.amount)}</Typography>
                <Show when={bid.timeBid}>
                <AccessAlarmOutlinedIcon/>
                    <Typography>Delivery Time:</Typography>
                    <Typography>{new Date(bid.timeBid).toLocaleDateString()},&nbsp;{new Date(bid.timeBid).toLocaleTimeString(undefined, {timeStyle: "short"})}</Typography>
                </Show>
            </Box>

            <Typography sx={{"mt": "16px"}}>{bid.note || ""}</Typography>
        </Box>
    </Box>
}