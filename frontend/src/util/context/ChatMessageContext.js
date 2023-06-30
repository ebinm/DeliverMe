import {createContext, useContext, useMemo, useState} from "react";
import {NotificationContext} from "./NotificationContext";
import {PUT_FETCH_OPTIONS} from "../util";


const ChatMessageContext = createContext({
    messages: [],
    sendMessage: async () => undefined,
    text: "",
    setText: () => undefined,
    error: undefined
})


export function ChatMessageProvider({order, children}) {

    const {receivedMessages} = useContext(NotificationContext)

    const [text, setText] = useState("")
    const [error, setError] = useState(undefined)

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

    }, [receivedMessages, order.messages, order._id])


    async function sendMessage() {
        if(text.trim() === ""){
            return
        }

        setError(undefined)
        setText("")
        const res = await fetch(`${process.env.REACT_APP_BACKEND}/api/orders/${order._id}/chat`, {
            ...PUT_FETCH_OPTIONS,
            method: "POST",
            body: JSON.stringify({
                content: text.trim()
            })
        })

        if (res.ok) {
            // The socket will emit a new received message so we do not have to do our own update.
        } else {
            setError("Could not send message.")
        }
    }

    return <ChatMessageContext.Provider value={{
        messages,
        sendMessage,
        text,
        setText,
        error
    }}>
        {children}
    </ChatMessageContext.Provider>
}

export {ChatMessageContext}