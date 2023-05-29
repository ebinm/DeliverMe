import React, {forwardRef, useContext, useRef, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Typography
} from "@mui/material"
import {createSearchParams, useLocation, useNavigate} from "react-router-dom";
import {CustomerContext} from "../util/context/CustomerContext";
import {For, Show} from "./util/ControlFlow";
import ListIcon from '@mui/icons-material/List';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import {mockedNotifications} from "../util/mockdata";
import GradeIcon from '@mui/icons-material/Grade';

export default function Header() {
    const navigate = useNavigate()
    const {customer} = useContext(CustomerContext)

    // TODO create a methode that says hi to the user

    return (
        <header>
            <Box bgcolor={"primary.main"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"}
                 alignItems={"center"} height={"90px"} width={"100%"} padding={"8px"}>
                <img src={"/images/logo.svg"} alt={"DeliverMe Logo"} height={"100%"}
                     onClick={() => navigate("/")}/>

                <Show when={customer} fallback={
                    <AuthenticationMenu/>
                }>{resolved => <LoggedInMenu customer={resolved}/>}
                </Show>
            </Box>
        </header>
    )
}

function AuthenticationMenu() {
    const navigate = useNavigate()
    const location = useLocation()

    return <Box display={"flex"} flexDirection={"row"}>
        <Button variant={"outlined"} onClick={() => navigate("/shopper/signup")} sx={{
            "borderRadius": "16px",
            "color": "text.main",
            "border": "1px solid",
            "borderColor": "text.main"
        }}>Join as a Personal Shopper</Button>
        <Divider orientation={"vertical"}
                 sx={{
                     "borderColor": "text.main",
                     "flexGrow": "1",
                     margin: "0 1em",
                     height: "auto"
                 }}/>
        <Button variant={"text"} onClick={() => navigate({
            pathname: "/login",
            search: createSearchParams({
                ref: location.pathname
            }).toString()
        })}
                sx={{"color": "text.main"}}>Login</Button>
    </Box>
}

function LoggedInMenu({customer}) {
    const [dialogOpen, setDialogOpen] = useState(false)

    const anchorEl = useRef();

    return <>
        <Box display={"flex"} flexDirection={"row"} sx={{"cursor": "pointer"}}
             onClick={(e) => {
                 // setAnchorEl(e.currentTarget)
                 setDialogOpen(b => !b)
             }}>
            <Avatar alt={customer.firstName + " " + customer.lastName} ref={anchorEl}/>
            <Divider orientation={"vertical"}
                     sx={{
                         "borderColor": "text.main",
                         "flexGrow": "1",
                         margin: "0 1em",
                         height: "auto"
                     }}/>
            <Typography component={"span"} sx={{"alignSelf": "center"}}
                        variant={"h6"}>{customer.firstName} {customer.lastName}</Typography>
        </Box>
        <AvatarDialog open={dialogOpen} close={() => setDialogOpen(false)} ref={anchorEl?.current}/>
    </>
}

const AvatarDialog = forwardRef(AvatarDialogRaw)

function AvatarDialogRaw({open, close}, ref) {
    const navigate = useNavigate()

    const {logout, customer} = useContext(CustomerContext)

    // For anchoring
    const notificationRef = useRef();
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const menuItemSx = {
        "bgcolor": "primary.main",
        "borderRadius": "8px",
        "padding": "12px 20px",
        "margin": "8px 0",
        "&:hover": {
            "backgroundColor": "selected.light"
        }
    }

    return (
        <>
            <Menu open={open} onClose={close}
                  anchorEl={ref}
                  anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                  }}
                  transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                  }}>
                <Box padding={"8px"} alignSelf={"center"} textAlign={"center"}>
                    <Typography variant={"h5"} component={"span"}>Menu</Typography>
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
                        <ListItemText>Browse Orders</ListItemText>
                    </MenuItem>

                    <MenuItem sx={{...menuItemSx, backgroundColor: notificationsOpen ? "selected.main" : undefined}}
                              ref={notificationRef} onClick={() => {
                        setNotificationsOpen(true)
                    }}>
                        <ListItemIcon>
                            <NotificationsIcon/>
                        </ListItemIcon>
                        <ListItemText>Notifications</ListItemText>
                    </MenuItem>

                    <MenuItem sx={menuItemSx} onClick={() => {
                        navigate(`/${customer.type.toLowerCase()}/my-orders`)
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
            <Notifications close={() => setNotificationsOpen(false)} open={notificationsOpen}
                           ref={notificationRef?.current}/>
        </>
    )
}

const Notifications = forwardRef(NotificationsRaw)

function NotificationsRaw({open, close}, ref) {

    // TODO probably going to use a context which contains a socket
    const [notifications,] = useState(mockedNotifications)

    const menuItemSx = {}

    return (
        <Menu open={open} onClose={close} elevation={10}
              anchorEl={ref}
              anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
              }}
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}>
            <MenuList sx={{
                "padding": "16px"
            }}>
                <Typography variant={"h6"} component={"span"}>Notifications</Typography>
                <For each={notifications} fallback={<Typography>No notifications</Typography>}>{notification =>
                    <MenuItem key={notification._id} sx={menuItemSx}>
                        <ListItemIcon>
                            {notificationTypeToIcon(notification.type)}
                        </ListItemIcon>
                        <ListItemText>{notification.msg}</ListItemText>
                    </MenuItem>
                }</For>
            </MenuList>
        </Menu>
    )
}

function notificationTypeToIcon(type){
    switch (type){
        case "rating":
            return  <GradeIcon/>
        default:
            return <></>
    }
}