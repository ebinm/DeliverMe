import {Backdrop, Popover, Slide} from "@mui/material";
import {ChatMessageContext, ChatMessageProvider} from "../../util/context/ChatMessageContext";
import Typography from "@mui/material/Typography";
import React, {useContext, useMemo} from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import {CustomerContext} from "../../util/context/CustomerContext";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import {For, Show} from "../util/ControlFlow";
import Button from "@mui/material/Button";
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import {useTheme} from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";

export function ChatOverlay({order, open, onClose}) {


    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up("sm"))

    const {customer} = useContext(CustomerContext)

    const otherPerson = useMemo(() => (customer.type === "BUYER") ? order.selectedBid.createdBy : order.createdBy, [order, customer.type])


    return <>
        {/* I guess we are just hoping these z indices are correct*/}
        <Backdrop open={open} sx={{"zIndex": "10000"}}/>
        <Popover open={open} TransitionComponent={Slide} sx={{"zIndex": "10001"}}
                 TransitionProps={{"direction": "left"}} slots={{"paper": Stack}} slotProps={{
            "paper": {"width": "100lvw", "height": "100lvh", "top": "0", "left": "0"}
        }}
                 marginThreshold={0}
                 anchorReference="anchorPosition"
                 anchorPosition={{top: 0, left: 0}}
                 anchorOrigin={{
                     vertical: 'top',
                     horizontal: 'left',
                 }}
                 transformOrigin={{
                     vertical: 'top',
                     horizontal: 'left',
                 }}
        >
            {/* This should probably be a hook and not a context */}
            <ChatMessageProvider order={order}>
                <ChatMessageContext.Consumer>{({messages, sendMessage, setText, text, error}) =>

                    <>
                        <Show when={desktop}>
                            <Box sx={{"flex": "1"}} onClick={onClose}/>
                        </Show>

                        <Stack sx={{"flex": "2", "backgroundColor": "white"}} direction={"column"}>


                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                <Button sx={{"minWidth": 0, "padding": 0}} onClick={onClose}>
                                    <ClearIcon sx={{
                                        "width": "40px",
                                        "height": "40px",
                                        "color": "text.main",
                                        "margin": "16px"
                                    }}/>
                                </Button>

                                <Stack direction={"row"} alignSelf={"center"} alignItems={"center"} gap={"8px"}
                                       margin={"16px 0"}>
                                    <Avatar imgProps={{sx: {padding: '0px'}}} sx={{"width": "56", "height": "56"}}
                                            alt={otherPerson.firstName + " " + otherPerson.lastName}
                                            src={otherPerson.profilePicture}/>
                                    <Typography
                                        variant={"h5"}>{otherPerson.firstName} {otherPerson.lastName}</Typography>
                                </Stack>


                                {/*We do a little trick here for nice centering :p*/}
                                <Box sx={{"width": "32px", "height": "100%", "margin": "16px"}}/>
                            </Stack>

                            <Divider/>

                            <Stack overflow={"auto"} direction={"column-reverse"} flexGrow={1}>
                                <For each={messages.slice().reverse()}>{msg =>
                                    <ChatMessage key={msg._id} message={msg} foreign={msg.sender !== customer.type}/>
                                }</For>
                            </Stack>


                            <Show when={error}>{() =>
                                <Typography marginTop={"16px"} alignSelf={"center"} fontWeight={"bolder"}
                                            color={"red"}>{error}</Typography>
                            }</Show>

                            <Stack direction={"row"}>
                                <TextField value={text} onChange={e => setText(e.target.value)} multiline
                                           sx={{"flexGrow": 1, "ml": "24px"}}
                                           onKeyDown={e => {
                                               if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
                                                   sendMessage()
                                                   e.preventDefault()
                                                   return false
                                               }
                                               return true
                                           }}/>
                                <Button onClick={sendMessage}>
                                    <SendIcon sx={{
                                        "padding": "8px",
                                        "borderRadius": "50%",
                                        "backgroundColor": "primary.dark",
                                        "color": "white",
                                        "height": "2em",
                                        "width": "2em",
                                        "aspectRatio": 1,
                                        "ml": "8px"
                                    }}/>
                                </Button>
                            </Stack>
                        </Stack>
                    </>

                }</ChatMessageContext.Consumer>
            </ChatMessageProvider>
        </Popover>
    </>
}


function ChatMessage({message, foreign}) {

    return <Box boxShadow={3} sx={{
        "alignSelf": foreign ? "start" : "end",
        "backgroundColor": foreign ? "#f2f2f7" : "#3d6cfe",
        "color": foreign ? "text.dark" : "white",
        "borderRadius": "16px",
        "maxWidth": "70%",
        "padding": "16px",
        "margin": "8px 16px",
        "wordBreak": "break-word",
        "whiteSpace": "pre-line",
    }}>
        <Stack direction={"column"} gap={"8px"}>
            <Typography variant={"body1"} sx={{
                "alignSelf": "start",
            }}>{message.content}</Typography>
            <Typography variant={"caption"} sx={{
                "alignSelf": "end",
                "color": foreign ? "lightgray" : "white"
            }}>{new Date(message.created).toLocaleString()}</Typography>
        </Stack>

    </Box>

}