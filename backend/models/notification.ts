import mongoose from "mongoose";


enum NotificationType {
    ChatMessageReceived = "ChatMessageReceived",
    BidPlacedOnOrder = "BidPlacedOnOrder",
    PaymentRequired = "PaymentRequired",
    BidAccepted = "BidAccepted",
    TransactionCompleted = "TransactionCompleted"
}

// Redundant User prefix to avoid naming collision
interface UserNotification {
    type: NotificationType,
    msg: string,
    date: Date,
    orderId?: string
}


const NotificationSchema = new mongoose.Schema<UserNotification>({
    type: {type: String, enum: Object.values(NotificationType), required: true},
    msg: {type: String, required: true},
    date: {type: Date, required: true},
    orderId: {type: String, required: false}
})


export {
    NotificationSchema,
    UserNotification,
    NotificationType
}