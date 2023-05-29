import {useMemo} from "react";
import {Avatar, Box, Typography} from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import AccessAlarmOutlinedIcon from "@mui/icons-material/AccessAlarmOutlined";
import {For} from "../util/ControlFlow";
import GradeIcon from '@mui/icons-material/Grade';

export function SingleBidView({bid, selected = false, setSelected = () => undefined, highlightOnHover = true}) {

    const currencyFormatter = useMemo(() => Intl.NumberFormat(undefined, {
        style: "currency",
        currency: bid.moneyBidWithFee.currency
    }), [bid.moneyBidWithFee.currency])

    const stars = Math.min(5, Math.floor(bid.createdBy.ratingStarAverage))
    console.log(stars)

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

                <Box alignItems={"center"} display={"flex"} flexDirection={"row"}>
                    <For each={Array(stars).fill(1).map((_, i) => i)}>{(i) =>
                        <GradeIcon key={i} sx={{"color": "#FFAC33"}}/>
                    }</For>
                    <For each={Array(5 - stars).fill(1).map((_, i) => i)}>{(i) =>
                        <GradeIcon key={i} sx={{"color": "text.light"}}/>
                    }</For>
                </Box>


                <LightbulbOutlinedIcon/>
                <Typography mr={"64px"}>Bid offered:</Typography>
                <Typography>{currencyFormatter.format(bid.moneyBidWithFee.amount)}</Typography>
                <AccessAlarmOutlinedIcon/>
                <Typography>DeliveryTime:</Typography>
                <Typography>{new Date(bid.timeBid).toLocaleDateString()},&nbsp;{new Date(bid.timeBid).toLocaleTimeString(undefined, {timeStyle: "short"})}</Typography>
            </Box>

            <Typography sx={{"mt": "16px"}}>{bid.note || ""}</Typography>
        </Box>
    </Box>
}