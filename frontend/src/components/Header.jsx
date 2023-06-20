import React, {forwardRef, useContext, useRef, useState} from "react";
import {
    Avatar,
    Badge,
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
import {createSearchParams, NavLink, useLocation, useNavigate} from "react-router-dom";
import {CustomerContext} from "../util/context/CustomerContext";
import {For, Show} from "./util/ControlFlow";
import ListIcon from '@mui/icons-material/List';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import GradeIcon from '@mui/icons-material/Grade';
import moment from "moment"
import {NotificationContext} from "../util/context/NotificationContext";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ClearIcon from '@mui/icons-material/Clear';
import EmailIcon from '@mui/icons-material/Email';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export default function Header() {
    const {customer} = useContext(CustomerContext)

    return (
        <header>
            <Box bgcolor={"primary.main"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"}
                 alignItems={"center"} height={"90px"} width={"100%"} padding={"8px"}>
                <Box sx={{"height": "100%"}}>
                    <NavLink to={"/"}>
                        <img src={"/images/logo.svg"} alt={"DeliverMe Logo"} height={"100%"}/>
                    </NavLink>
                </Box>

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

    const {notifications} = useContext(NotificationContext)

    return <>
        <Box display={"flex"} flexDirection={"row"} sx={{"cursor": "pointer"}}
             onClick={() => {
                 setDialogOpen(b => !b)
             }}>
            <Badge
                overlap="circular"
                invisible={notifications.length === 0}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                badgeContent={
                    <NotificationsActiveIcon sx={{
                        "backgroundColor": "orange",
                        "color": "white",
                        "borderRadius": "50%",
                        "height": "22px",
                        "width": "22px",
                        "padding": "2px",
                        "animation": "pulse 4s infinite ease-in-out",
                        "@keyframes pulse": {
                            "0%": {
                                transform: 'scale(1) rotate(0)'
                            },
                            "5%": {
                                transform: "rotate(-10deg)"
                            },
                            "10%": {
                                transform: 'scale(1.2) rotate(10deg)'
                            },
                            "20%": {
                                transform: 'scale(1) rotate(0)'
                            }
                        }
                    }}/>
                }
            >
                <Avatar imgProps={{sx: {padding: '0px'}}} alt={customer.firstName + " " + customer.lastName}
                        ref={anchorEl}
                        src={`data:image/jpeg;base64,${customer.profilePicture}`}/>
            </Badge>

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

    // TODO mark if any notifications
    const {notifications} = useContext(NotificationContext)

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
                            <NotificationsIcon sx={{
                                "color": notifications.length !== 0 ? "orange" : undefined
                            }}/>
                        </ListItemIcon>
                        <ListItemText>Notifications</ListItemText>
                    </MenuItem>


                    <MenuItem sx={menuItemSx} onClick={() => {
                        navigate(`/${customer.type.toLowerCase()}/my-orders`)
                        close()
                    }}>
                        <ListItemIcon>
                            <ChecklistIcon/>
                        </ListItemIcon>
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
            <Notifications close={() => {
                setNotificationsOpen(false)
                // markAsRead()
            }} open={notificationsOpen}
                           ref={notificationRef?.current}/>
        </>
    )
}

const Notifications = forwardRef(NotificationsRaw)

function NotificationsRaw({open, close}, ref) {

    const {notifications, markAsRead} = useContext(NotificationContext)
    const {customer} = useContext(CustomerContext)
    const navigate = useNavigate()

    const menuItemSx = {
        "margin": "8px 0",
        "&:hover": {
            "backgroundColor": "selected.light"
        }
    }

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
                "padding": "16px",
                "maxHeight": "50vh"
            }}>
                <Typography variant={"h6"} component={"span"}>Notifications</Typography>
                <For each={notifications} fallback={<Typography>No notifications</Typography>}>{notification =>
                    <MenuItem key={notification._id} sx={menuItemSx} onClick={() => {
                        const destination = notificationTypeToLink(notification.type, notification.orderId, customer.type)
                        if (destination) {
                            navigate(destination)
                        }
                    }}>
                        <Box display={"grid"} gridTemplateColumns={"min-content auto min-content"} flexGrow={1}
                             columnGap={"8px"} alignItems={"center"}>
                            <ListItemIcon sx={{"gridRow": "span 2"}}>
                                {notificationTypeToIcon(notification.type)}
                            </ListItemIcon>
                            <ListItemText>{notification.msg}</ListItemText>
                            <ListItemIcon onClick={(e) =>{
                                e.stopPropagation()
                                markAsRead(notification._id)
                            }
                            } sx={{
                                "gridRow": "span 2", "gridColumn": 3, "&:hover": {
                                    "color": "primary.dark"
                                }
                            }}>
                                <ClearIcon/>
                            </ListItemIcon>
                            <ListItemText
                                sx={{
                                    color: "text.light",
                                    "alignSelf": "end",
                                    "minWidth": "0"
                                }}>{moment(notification.date).fromNow()}
                            </ListItemText>
                        </Box>
                    </MenuItem>
                }</For>
            </MenuList>
        </Menu>
    )
}

function notificationTypeToLink(type, orderId, customerType) {
    switch (type) {
        case "ChatMessageReceived":
            // TODO actual path
            return `/${customerType.toLowerCase()}/${orderId || ""}/chat`
        case "BidPlacedOnOrder":
        case "BidAccepted":
            return `/${customerType.toLowerCase()}/my-orders/${orderId || ""}`
        case "PaymentRequired":
            // TODO actual path
            return "/checkout"
        default:
            return undefined
    }
}

function notificationTypeToIcon(type) {
    switch (type) {
        case "ChatMessageReceived":
            return <EmailIcon/>
        case "BidPlacedOnOrder":
            return <LocalOfferIcon/>
        case "PaymentRequired":
            return <PaymentIcon/>
        case "BidAccepted":
            return <GradeIcon/>
        default:
            return <></>
    }
}