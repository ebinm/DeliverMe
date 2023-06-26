
import {Buyer, Customer, CustomerType, Shopper} from './customer';
import mongoose, {Schema, Types} from 'mongoose';
import {Order, OrderModel} from "./order";


interface Review extends mongoose.Document {
    // _id: Schema.Types.ObjectId; // automatically created by MongoDB
    rating: number;
    creationTime: Date;
    note: string;
    createdBy: Types.ObjectId;
    order: Types.ObjectId;
}



const ReviewSchema = new Schema<Review>(
    {
        rating: { type: Number, required: true },
        creationTime: { type: Date, required: true },
        note: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: Buyer, required: true } ||
            { type: Schema.Types.ObjectId, ref: Shopper, required: true },
        order: { type: Schema.Types.ObjectId, ref: OrderModel, required: true }
    }
);

export {Review, ReviewSchema}