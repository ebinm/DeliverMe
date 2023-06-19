import {createContext, useContext, useEffect, useState} from "react";
import {CustomerContext} from "./CustomerContext";
import {io} from "socket.io-client";


const NotificationContext = createContext({
    notifications: [],
    markAsRead: () => undefined
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
        ws.on("message", (event) => {
            // TODO actually filter the type of event that was received so we can support
            setNotifications(prev => [JSON.parse(event.data), ...prev])
        })

        return () => {
            ws.close()
        }
    }, [customer?._id])


    return <NotificationContext.Provider value={{
        notifications: notifications,
        markAsRead: () => setNotifications([])
    }}>
        {children}
    </NotificationContext.Provider>
}

export {
    NotificationContext,
    NotificationProvider
}




