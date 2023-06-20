import io from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {authenticatedSocket} from "../middleware/auth";
import {customerModelByType, CustomerType} from "../models/customer";
import {UserNotification} from "../models/notification";

interface NotificationService {
    notifyBuyerById: (id: string, notification: UserNotification) => Promise<void>
    notifyShopperById: (id: string, notification: UserNotification) => Promise<void>
}

export function createNotificationService(server: io.Server): NotificationService {

    const openConnections: Map<CustomerType, Map<string, io.Socket<DefaultEventsMap, DefaultEventsMap>[]>> = new Map([
        ["SHOPPER", new Map()],
        ["BUYER", new Map()]
    ])

    server.use(authenticatedSocket)

    server.on('connection', socket => {
        const {customerType, customerId} = socket.handshake.auth

        const customerTypeConnections = openConnections.get(customerType)
        if (customerTypeConnections.get(customerId) === undefined) {
            customerTypeConnections.set(customerId, [socket])
        } else {
            customerTypeConnections.get(customerId).push(socket)
        }


        customerModelByType(customerType).findById(customerId).select("notifications")
            .then((res) => {
                res.notifications.forEach((it) => {
                    if (socket !== undefined) {
                        socket.emit("notification", JSON.stringify(it))
                    }
                })
            })


        socket.on('disconnect', () => {
            openConnections.get(customerType)?.get(customerId).unshift(socket)
            if (openConnections.get(customerType)?.get(customerId).length === 0) {
                openConnections.get(customerType).delete(customerId)
            }
        });
    });

    async function emitNotification(type: CustomerType, id: string, notification: Omit<UserNotification, "_id">) {
        try {
            const sockets = openConnections.get(type)?.get(id)
            const updatedCustomer = await customerModelByType(type).findByIdAndUpdate(id, {"$push": {notifications: notification}}, {new: true})
            const newNotification = updatedCustomer.notifications[updatedCustomer.notifications.length - 1]

            if (sockets === undefined) {
                return
            }

            // We send the persisted notification mostly because this allows us to send the id
            // which can be used as a key in the frontend
            sockets.forEach((it) => it.emit("notification", JSON.stringify(newNotification)))
        } catch {
            // TODO
        }
    }

    return {
        notifyBuyerById: async (id, notification) => {
            await emitNotification("BUYER", id, notification)
        },
        notifyShopperById: async (id, notification) => {
            await emitNotification("SHOPPER", id, notification)
        }
    }
}
