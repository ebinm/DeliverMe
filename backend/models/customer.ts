import mongoose from "mongoose";
import {NotificationSchema, UserNotification} from "./notification";


type CustomerType = "BUYER" | "SHOPPER"

interface Customer extends mongoose.Document {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    profilePicture: string,
    avgRating: number,
    notifications: UserNotification[],
    phoneNumber: string | null | undefined,
    paypalAccount: string | undefined
}

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
    },
    avgRating: {
        type: Number,
        default: null
    },
    phoneNumber: {
        type: String,
        required: false
    },
    paypalAccount: {
        type: String,
        required: false
    }
});

const Buyer = mongoose.model('Buyer', CustomerSchema);
const Shopper = mongoose.model('Shopper', CustomerSchema);


/**
 * Quick helper for selecting the right model based on the type.
 */
function customerModelByType(type: CustomerType) {
    if (type === "SHOPPER") {
        return Shopper
    } else if (type === "BUYER") {
        return Buyer
    } else {
        //TODO: panic
    }
}


export {
    customerModelByType,
    Typed,
    CustomerType,
    Customer,
    Shopper,
    Buyer
}