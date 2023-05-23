import mongoose from "mongoose";

type CustomerType = {
    email: string,
    firstName: string,
    lastName: string,
    password: string
}

const CustomerSchema = new mongoose.Schema<CustomerType>({
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
    }
});

const Shopper = mongoose.model('Buyer', CustomerSchema);
const Buyer = mongoose.model('Shopper', CustomerSchema);

export {
    CustomerType,
    Shopper,
    Buyer
}