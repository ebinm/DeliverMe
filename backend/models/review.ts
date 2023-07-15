
import {Buyer, Shopper} from './customer';
import mongoose, {Schema, Types} from 'mongoose';
import {OrderModel} from "./order";


interface Review extends mongoose.Document {
    // _id: Schema.Types.ObjectId; // automatically created by MongoDB
    type: "Buyer" | "Shopper";
    customer: Types.ObjectId;
    rating: number;
    creationTime: Date;
    note: string;
    createdBy: Types.ObjectId;
    order: Types.ObjectId;
}



const reviewSchema = new Schema<Review>(
    {
        type: {
            type: String,
            required: true,
            enum: ["Buyer", "Shopper"]
        },
        customer: { type: Schema.Types.ObjectId, refPath: 'type', required: true },
        rating: { type: Number, required: true },
        creationTime: { type: Date, required: true },
        note: { type: String, required: false },
        createdBy: { type: Schema.Types.ObjectId, ref: Buyer, required: true } ||
            { type: Schema.Types.ObjectId, ref: Shopper, required: true },
        order: { type: Schema.Types.ObjectId, ref: OrderModel, required: true }
    }
);

const ReviewModel = mongoose.model<Review>('Review', reviewSchema);

export {Review, reviewSchema, ReviewModel}