import React from "react";
import {Box} from "@mui/material"

import {useTheme} from "@mui/material/styles"
import {Button} from "@mui/material"
import {useNavigate} from "react-router-dom";

export default function Header() {
    const navigate = useNavigate()
    const theme = useTheme()

    // creat a methode that says hi to the user

    return (
        <header>
            <Box bgcolor={theme.palette.primary.main} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} height={"90px"} width={"100%"} padding={"8px"}>
                <img src={"/images/logo.svg"} alt={"DeliverMe Logo"} height={"100%"} onClick={() => navigate("/")}/>
                <Box display={"flex"} flexDirection={"row"}>
                    <Button variant={"outlined"} onClick={() => navigate("/personal-shopper/signup")} sx={{"borderRadius": "16px", "color": "text.primary", "border": "1px solid " + theme.palette.text.primary}}>Join as a Personal Shopper</Button>
                    <div className={"vl"} style={{"outlineColor": theme.palette.text.primary}}/>
                    <Button variant={"text"} onClick={() => navigate("/login")} sx={{"color": "text.primary"}} >Login</Button>
                </Box>
            </Box>
        </header>
    )
}