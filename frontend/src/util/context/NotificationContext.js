import {createContext, useContext, useEffect, useState} from "react";
import {CustomerContext} from "./CustomerContext";
import {io} from "socket.io-client";


const NotificationContext = createContext({
    notifications: [],
    markAsRead: () => Promise.resolve()
})


function NotificationProvider({children}) {
    // TODO fetch initial unread notifications
    // Represents only new notifications -> clear on read
    const [notifications, setNotifications] = useState([])
    const {customer} = useContext(CustomerContext)


    useEffect(() => {
        // TODO make url dynamic

        const ws = io("wss://localhost:8443", {
            withCredentials: true
        })
        ws.on("notification", (event) => {
            // TODO actually filter the type of event that was received so we can support
            setNotifications(prev => [JSON.parse(event), ...prev])
        })

        return () => {
            setNotifications([])
            ws.close()
        }
    }, [customer?._id])


    return <NotificationContext.Provider value={{
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




