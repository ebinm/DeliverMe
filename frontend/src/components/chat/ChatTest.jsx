import React, {useContext, useMemo, useState} from "react";
import {NotificationContext} from "../../util/context/NotificationContext";
import Stack from "@mui/material/Stack";
import {For} from "../util/ControlFlow";
import Typography from "@mui/material/Typography";
import {CustomerContext} from "../../util/context/CustomerContext";
import {Paper} from "@mui/material";
import TextField from "@mui/material/TextField";
import {PUT_FETCH_OPTIONS} from "../../util/util";


export function ChatTest({order}) {

    const {receivedMessages} = useContext(NotificationContext)
    const {customerType} = useContext(CustomerContext)

    const [text, setText] = useState("")

    const messages = useMemo(() => {
        // A better data structure for the received messages might be clever but honestly, the message
        // cache should not hold a large amount of messages at any time and thus this primitive implementation
        // should suffice

        // We will just assume all messages are ordered correctly
        const orderMessages = order.messages || []
        const lastId = orderMessages.length === 0 ? undefined : orderMessages[orderMessages.length - 1]._id

        const sliceInd = receivedMessages.findIndex(it => it._id === lastId) + 1
        const filteredReceived = receivedMessages
            .slice(sliceInd)
            .filter(it => it.orderId === order._id)

        return [
            ...orderMessages,
            ...filteredReceived
        ]

    }, [receivedMessages, order.messages])


    async function sendMessage() {
        const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${order._id}/chat`, {
            ...PUT_FETCH_OPTIONS,
            method: "POST",
            body: JSON.stringify({
                content: text
            })
        })

        console.log(res)

        if (res.ok) {
            // The socket will emit a new received message so we do not have to do our own update.
        } else {
            console.error("Could not send message")
            // TODO panic
        }
    }


    return <Stack direction={"column"}>
        <For each={messages}>{message =>
            <ChatMessage key={message._id} message={message} foreign={customerType !== message.receiver}/>
        }</For>

        <Stack direction={"row"}>
            <TextField value={text} onChange={e => setText(e.target.value)}
                       onKeyDown={e => {
                           if (e.key === "Enter") {
                               setText("")
                               sendMessage()
                               return false
                           }
                           return true
                       }}
            />
        </Stack>

    </Stack>
}

function ChatMessage({message, foreign}) {


    return <Paper sx={{
        "bgColor": foreign ? "blue" : "white"
    }}>
        <Stack direction={"row"} gap={"16px"}>
            <Typography>{message.content}</Typography>
            <Typography>{message._id}</Typography>
        </Stack>
    </Paper>


}