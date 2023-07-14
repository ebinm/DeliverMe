import io from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {authenticatedSocket} from "../middleware/auth";
import {customerModelByType, CustomerType} from "../models/customer";
import {NotificationType, UserNotification} from "../models/notification";
import {Order, OrderModel} from "../models/order";
import {Message} from "../models/message";

/**
 * A service for providing notification and chat functionality.
 *
 * Notifications and chat messages sent using this service are persisted to the database and if possible propagated using
 * socket.io.
 *
 */
interface NotificationService {
    notifyBuyerById: (id: string, notification: UserNotification) => Promise<void>
    notifyShopperById: (id: string, notification: UserNotification) => Promise<void>
    sendChatMessage: (order: Order, chatMessage: Message) => Promise<Message>
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
                res?.notifications?.forEach((it) => {
                    if (socket !== undefined) {
                        socket.emit("initial_notification", JSON.stringify(it))
                    }
                })
            })


        socket.on('disconnect', () => {
            const newConnections = openConnections.get(customerType)?.get(customerId)
                .filter(it => it !== socket)

            if (newConnections.length === 0) {
                openConnections.get(customerType).delete(customerId)
            } else {
                openConnections.get(customerType)?.set(customerId, newConnections)
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
        } catch (e) {
            console.error(e)
            // TODO
        }
    }

    return {
        notifyBuyerById: async (id, notification) => {
            await emitNotification("BUYER", id, notification)
        },
        notifyShopperById: async (id, notification) => {
            await emitNotification("SHOPPER", id, notification)
        },
        sendChatMessage: async (order, message) => {
            if (!order?.createdBy || !order?.selectedBid?.createdBy) {
                throw Error("Both a buyer and a shopper must be assigned to an order before messages can be sent.")
            }

            try {
                const updatedOrder = await OrderModel.findByIdAndUpdate(order._id, {"$push": {messages: message}}, {new: true})
                    .select("-groceryBill -groceryShop")
                const newMessage = updatedOrder.messages[updatedOrder.messages.length - 1]

                // We notify both parties
                const socketsShopper = openConnections.get("SHOPPER")?.get(order.selectedBid.createdBy.toString())
                socketsShopper?.forEach(it => {
                     it.emit("chat", JSON.stringify(newMessage))
                })

                const socketsBuyer = openConnections.get("BUYER")?.get(order.createdBy.toString())
                socketsBuyer?.forEach(it => {
                    it.emit("chat", JSON.stringify(newMessage))
                })


                let receiver;
                let receiverType;

                if (newMessage.sender === "SHOPPER") {
                    receiver = order.createdBy.toString()
                    receiverType = "BUYER"
                } else {
                    receiver = order.selectedBid.createdBy.toString()
                    receiverType = "SHOPPER"
                }


                // TODO not sure if always sending a notification is a great idea. Maybe delete old chat notifications
                // for same order when doing this.
                emitNotification(receiverType, receiver, {
                    msg: "You have received a new chat message.",
                    type: NotificationType.ChatMessageReceived,
                    date: new Date(),
                    orderId: order._id
                })
                return newMessage
            } catch (e) {
                console.error(e)
                //TODO
            }
        }
    }
}
