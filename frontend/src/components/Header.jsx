import React, {useContext, useState} from "react";
import {Avatar, Box, Button, Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList} from "@mui/material"
import {useNavigate} from "react-router-dom";
import {CustomerContext} from "../util/context/CustomerContext";
import {Show} from "./util/SolidJS";
import ListIcon from '@mui/icons-material/List';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Header() {
    const navigate = useNavigate()

    const {customer} = useContext(CustomerContext)

    const [dialogOpen, setDialogOpen] = useState(false)

    return (

        <header>
            <Box bgcolor={"primary.main"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"}
                 alignItems={"center"} height={"90px"} width={"100%"} padding={"8px"}>
                <img src={"/images/logo.svg"} alt={"DeliverMe Logo"} height={"100%"}
                     onClick={() => navigate("/")}/>

                <Box display={"flex"} flexDirection={"row"}>
                    <Show when={customer} fallback={
                        <>
                            <Button variant={"outlined"} onClick={() => navigate("/shopper/signup")} sx={{
                                "borderRadius": "16px",
                                "color": "text.primary",
                                "border": "1px solid",
                                "borderColor": "text.primary"
                            }}>Join as a Personal Shopper</Button>
                            <Divider orientation={"vertical"}
                                     sx={{
                                         "borderColor": "text.primary",
                                         "flexGrow": "1",
                                         margin: "0 1em",
                                         height: "auto"
                                     }}/>
                            <Button variant={"text"} onClick={() => navigate("/login")}
                                    sx={{"color": "text.primary"}}>Login</Button>
                        </>
                    }>{resolved => <>
                        <Avatar alt={resolved.firstName + " " + resolved.lastName}
                                onClick={() => setDialogOpen(b => !b)}/>
                        <Divider orientation={"vertical"}
                                 sx={{
                                     "borderColor": "text.primary",
                                     "flexGrow": "1",
                                     margin: "0 1em",
                                     height: "auto"
                                 }}/>
                        <Box alignSelf={"center"} onClick={() => setDialogOpen(b => !b)}>
                            <strong>{resolved.firstName} {resolved.lastName}</strong>
                        </Box>
                        <AvatarDialog open={dialogOpen} close={() => setDialogOpen(false)}/>
                    </>}
                    </Show>
                </Box>
            </Box>
        </header>
    )
}

function AvatarDialog({open, close}) {
    const navigate = useNavigate()

    const {logout} = useContext(CustomerContext)

    const menuItemSx = {
        "bgcolor": "primary.main",
        "borderRadius": "8px",
        "padding": "12px 20px",
        "margin": "8px 0"
    }

    return (
        <Menu open={open} onClose={close}
              anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}>
            <Box padding={"16px"} alignSelf={"center"} textAlign={"center"}>
                <h2>Menu</h2>
            </Box>
            <MenuList sx={{
                "padding": "16px"
            }}>
                <MenuItem sx={menuItemSx} onClick={() => {
                    // TODO location
                    navigate("/browseorders")
                    close()
                }}>
                    <ListItemIcon>
                        <ListIcon/>
                    </ListItemIcon>
                    <ListItemText>Brose Orders</ListItemText>
                </MenuItem>

                <MenuItem sx={menuItemSx} onClick={() => {
                    // TODO location
                    navigate("/browseorders")
                    close()
                }}>
                    <ListItemIcon>
                        <NotificationsIcon/>
                    </ListItemIcon>
                    <ListItemText>Notifications</ListItemText>
                </MenuItem>

                <MenuItem sx={menuItemSx} onClick={() => {
                    // TODO location
                    navigate("/browseorders")
                    close()
                }}>
                    <ListItemIcon/>
                    <ListItemText>My orders</ListItemText>
                </MenuItem>

                <MenuItem sx={menuItemSx} onClick={() => {
                    // TODO location
                    navigate("/")
                    close()
                    logout()
                }}>
                    <ListItemIcon>
                        <LogoutIcon/>
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </MenuList>
        </Menu>
    )
}