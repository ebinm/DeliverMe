import {Typography} from "@mui/material";
import {Show} from "../util/ControlFlow";
import Stack from "@mui/material/Stack";
import moment from "moment";

export function DateDisplay({from, to}) {

    return <Stack direction={"row"} margin={"8px 0"}>
        <Show when={from || to}>
            <Typography component={"span"}>Delivery:&nbsp;</Typography>
        </Show>
        <Show when={from}>{() =>
            <>
                <Typography component={"span"} color={"text.light"}>From&nbsp;</Typography>
                <Typography
                    component={"span"}>{moment(from).format("lll")}&nbsp;</Typography>
            </>
        }</Show>
        <Show when={to}>{() =>
            <>
                <Typography component={"span"} color={"text.light"}>To&nbsp;</Typography>
                <Typography
                    component={"span"}>{moment(to).format("lll")}</Typography>
            </>
        }
        </Show>
    </Stack>
}