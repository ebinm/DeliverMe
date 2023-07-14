import {createContext, useContext, useEffect, useState} from "react";
import {CustomerContext} from "./CustomerContext";
import {io} from "socket.io-client";
import {useSnackbar} from 'notistack';

const NotificationContext = createContext({
    notifications: [],
    markAsRead: () => Promise.resolve(),
    receivedMessages: [],
})


function NotificationProvider({children}) {
    // TODO fetch initial unread notifications
    // Represents only new notifications -> clear on read
    const [notifications, setNotifications] = useState([])
    const {customer} = useContext(CustomerContext)
    const {enqueueSnackbar} = useSnackbar();


    // We store all messages that we have received since this context was created
    // We know that this context is always older than any collection of orders fetched.
    // We thus always have all messages for orders but might have duplicate messages:
    // Context Created -> Message Received -> Order fetched
    // When displaying we this have to first correlate by orderId and then filter messages that we already have
    const [receivedMessages, setReceivedMessages] = useState([])


    useEffect(() => {

        const ws = io(process.env.REACT_APP_WEBSOCKET, {
            withCredentials: true
        })

        ws.on("notification", (event) => {
            enqueueSnackbar("New Notification Received!", {variant: 'info'})
            setNotifications(prev => [JSON.parse(event), ...prev])
        })

        ws.on("initial_notification", (event) => {
            setNotifications(prev => [JSON.parse(event), ...prev])
        })

        ws.on("chat", (event) => {
            setReceivedMessages(prev => [...prev, JSON.parse(event)])
        })

        return () => {
            console.log("Disconnecting on client")
            setNotifications([])
            ws.close()
        }
    }, [customer?._id])


    return <NotificationContext.Provider value={{
        receivedMessages: receivedMessages,
        notifications: notifications,
        markAsRead: async (notificationId) => {
            // id === undefined -> mark all as read

            // optimistic update
            if (notificationId === undefined) {
                setNotifications([])
            } else {
                setNotifications(n => n.filter(it => it._id !== notificationId))
            }

            await fetch(`${process.env.REACT_APP_BACKEND}/api/me/notification?` + new URLSearchParams({
                "notificationId": notificationId
            }).toString(), {
                method: "DELETE",
                credentials: 'include'
            })
        }
    }}>
        {children}
    </NotificationContext.Provider>
}

export {
    NotificationContext,
    NotificationProvider
}




