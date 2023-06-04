import {Button} from "@mui/material";


function DarkButton(props) {
    return <Button {...props} sx={{...darkButtonSx, ...props.sx}}/>
}

function OutlinedButton(props) {
    return <Button variant={"outlined"} {...props} sx={{...outlinedButtonSx, ...props.sx}}/>
}


const darkButtonSx = {
    "alignSelf": "flex-end",
    "width": "160px",
    "backgroundColor": "primary.dark",
    "color": "primary.light",
    "&:hover": {
        "outlineColor": "primary.dark",
        "outlineWidth": "2px",
        "outlineStyle": "solid",
        "color": "primary.dark",
    }
}

const outlinedButtonSx = {
    "color": "primary.dark",
    "borderColor": "primary.dark"
}

export {DarkButton, OutlinedButton, darkButtonSx, outlinedButtonSx}