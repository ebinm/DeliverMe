import io from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {authenticatedSocket} from "../middleware/auth";
import {CustomerType, UserNotification} from "../models/customer";

interface NotificationService {
    notifyBuyerById: (id: number, notification: UserNotification) => void
    notifyShopperById: (id: number, notification: UserNotification) => void
}

export function createNotificationService(server: io.Server): NotificationService {

    const openConnections: Map<[CustomerType, number], io.Socket<DefaultEventsMap, DefaultEventsMap>> = new Map()

    server.use(authenticatedSocket)

    server.on('connection', socket => {
        const {customerType, customerId} = socket.handshake.auth
        openConnections.set([customerType, customerId] as [CustomerType, number], socket)

        socket.on('event', () => {
            // TODO
        });

        socket.on('disconnect', () => {
            openConnections.delete([customerType, customerId])
        });
    });

    function emitNotification(type: CustomerType, id: number, notification: UserNotification) {
        try {
            const socket = openConnections.get([type, id])
            if (socket === undefined) {
                return
            }
            socket.emit("notification", JSON.stringify(notification))
        } catch {
            // TODO
        }
    }

    return {
        notifyBuyerById: (id, notification) => {
            emitNotification("BUYER", id, notification)
        },
        notifyShopperById: (id, notification) => {
            emitNotification("SHOPPER", id, notification)
        }
    }
}
