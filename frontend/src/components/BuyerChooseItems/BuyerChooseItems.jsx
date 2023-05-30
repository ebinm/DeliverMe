import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Divider from "@mui/material/Divider";
import {Show} from "../util/ControlFlow";
import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined';
import AccessAlarmsOutlinedIcon from '@mui/icons-material/AccessAlarmsOutlined';
import {DateTimePicker} from "@mui/x-date-pickers";
import {useState} from "react";
import TextField from "@mui/material/TextField";

export function BuyerChooseItems({shop}) {

    const [from, setFrom] = useState()
    const [to, setTo] = useState()


    const iconSx = {"color": "primary.dark", "gridRow": "span 2", "width": "40px", "height": "40px"}

    const containerSx = {
        "display": "grid",
        "gridTemplateColumns": "min-content auto",
        "justifyContent": "center",
        "alignItems": "center",
        "columnGap": "16px"
    }

    const dateInputSx = {
        "border": "none",
        "outline": "none",
    }

    const headerSx = {
        "textAlign": "center",
        "alignSelf": "self-end",
        "color": "text.light"
    }

    return <>
        <Typography variant={"h4"} component={"h1"}>Fill your order</Typography>

        <Box shadow={1} borderRadius={"16px"} display={"flex"} flexDirection={"row"} padding={"32px"} marginTop={"16px"}
             justifyContent={"space-around"} backgroundColor={"white"}>

            <Show when={shop.name}>
                <Box sx={containerSx}>
                    <ShoppingCartOutlinedIcon sx={iconSx}/>
                    <Typography sx={headerSx}>Chosen
                        shop</Typography>
                    <Typography textAlign={"center"} sx={{"alignSelf": "self-start"}}
                                alignSelf={"top"}>{shop.name}</Typography>
                </Box>

                <Divider orientation={"vertical"} sx={{"height": "auto"}}/>
            </Show>


            <Box sx={containerSx}>
                <AccessAlarmsOutlinedIcon sx={iconSx}/>
                <Typography sx={headerSx} >Delivery time</Typography>
                <Box sx={containerSx}>
                        <Typography color={"text.light"}>From</Typography>
                        <DateTimePicker
                            disablePast
                            sx={dateInputSx}
                            slotProps={{"textField": {variant: "standard"}}}/>

                        <Typography color={"text.light"} justifySelf={"flex-end"}>To</Typography>
                        <DateTimePicker
                            disablePast
                            variant={"standard"}
                            sx={dateInputSx}
                            slotProps={{"textField": {variant: "standard"}}}/>

                </Box>
            </Box>

            <Divider orientation={"vertical"} sx={{"height": "auto"}}/>

            <Box sx={containerSx}>
                <SpeakerNotesOutlinedIcon sx={iconSx}/>
                <Typography sx={headerSx}>Additional notes</Typography>
                <TextField multiline
                           sx={dateInputSx}
                           fullwidth
                           variant={"standard"}
                           InputProps={{
                               "sx": {
                                   "border": "none",
                                   "outline": "none",
                               }
                           }}

                />
            </Box>
        </Box>
    </>
}