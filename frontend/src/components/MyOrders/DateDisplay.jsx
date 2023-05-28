import {Box, Typography} from "@mui/material";
import {Show} from "../util/ControlFlow";

export function DateDisplay({from, to}) {

    const fromDate = from && new Date(from)
    const toDate = to && new Date(to)

    return <Box display={"flex"} flexDirection={"row"} margin={"8px 0"}>
        <Show when={fromDate || toDate}>
            <Typography component={"span"}>Delivery:&nbsp;</Typography>
        </Show>
        <Show when={fromDate}>{() =>
            <>
                <Typography component={"span"} color={"text.light"}>From&nbsp;</Typography>
                <Typography
                    component={"span"}>{fromDate.toLocaleDateString()},&nbsp;{fromDate.toLocaleTimeString(undefined, {timeStyle: 'short'})}&nbsp;</Typography>
            </>
        }</Show>
        <Show when={toDate}>{() =>
            <>
                <Typography component={"span"} color={"text.light"}>To&nbsp;</Typography>
                <Typography
                    component={"span"}>{toDate.toLocaleDateString()},&nbsp;{toDate.toLocaleTimeString(undefined, {timeStyle: 'short'})}</Typography>
            </>
        }
        </Show>
    </Box>
}