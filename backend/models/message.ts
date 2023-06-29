import {CustomerType} from "./customer";
import mongoose from "mongoose";


interface Message {
    content: string,
    created: Date,
    sender: CustomerType,
    orderId: string // We do not bother setting up a proper reference as this should only be used for correlating messages to orders in the frontend
}


const messageSchema = new mongoose.Schema<string>({
    content: {type: String, required: true},
    created: {type: Date, required: true},
    sender: {type: String, enum: ["SHOPPER", "BUYER"], required: true},
    orderId: {type: String, required: true}
})


export {
    Message,
    messageSchema
}