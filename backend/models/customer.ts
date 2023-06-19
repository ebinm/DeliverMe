import mongoose, {Document} from "mongoose";

export enum NotificationType {
    MessageReceived = "MessageReceived"
}

// Redundant User prefix to avoid naming collision
export interface UserNotification extends Document {
    type: NotificationType
}

type Customer = {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    profilePicture: string,
    notifications: UserNotification[]
}

const NotificationSchema = new mongoose.Schema<Notification>({
    type: {type: String, enum: Object.values(NotificationType), required: true},
})

type CustomerType = "BUYER" | "SHOPPER"


/**
 * A type to be used in a type union with the CustomerType to distinguish buyers from shoppers.
 */
type Typed = {
    type: CustomerType
}

const CustomerSchema = new mongoose.Schema<Customer>({
    email: {
        type: String,
        unique: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String
    },
    profilePicture: {
        type: String
    },
    notifications: {
        type: [NotificationSchema]
    }
});

const Buyer = mongoose.model('Buyer', CustomerSchema);
const Shopper = mongoose.model('Shopper', CustomerSchema);

export {
    Typed,
    CustomerType,
    Customer,
    Shopper,
    Buyer
}