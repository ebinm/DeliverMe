import mongoose from "mongoose";

type Customer = {
    email: string,
    firstName: string,
    lastName: string,
    password: string
}

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