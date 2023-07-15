import {Button} from "@mui/material";


function DarkButton(props) {
    const {sx, ...other} = props
    return <Button variant={"text"} {...other} sx={{...darkButtonSx, ...sx}}/>
}

function OutlinedButton(props) {
    const {sx, ...other} = props
    return <Button variant={"outlined"} {...other} sx={{...outlinedButtonSx, ...sx}}/>
}


const darkButtonSx = {
    "alignSelf": {"sm": "stretch", "md": "flex-end"},
    "minWidth": "160px",
    "backgroundColor": "primary.dark",
    "color": "primary.light",
    "&:hover": {
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