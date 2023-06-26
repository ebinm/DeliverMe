import mongoose, { Document, Schema } from 'mongoose';
import {Buyer} from './customer';
import { Item, itemSchema } from './item';
import { Bid, bidSchema } from './bid';
import {Receipt} from "./receipt";

type Location = {
    // _id: Schema.Types.ObjectId; // automatically created by MongoDB
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    name: string, // Only shop locations have a name 
    street: string,
    city: string | null,
}

export enum OrderStatus {
    Open = "Open",
    InDelivery = "In Delivery",
    InPayment = "In Payment",
    Finished = "Finished",
  }

export interface Order extends Document {
    //_id: Schema.Types.ObjectId;   // automatically created by MongoDB
    status: OrderStatus;
    groceryBill: Receipt;
    creationDate: Date;
    latestDeliveryDate: Date;
    earliestDeliveryDate: Date;
    totalCostOfItems: number;
    totalCostOfOrder: number;
    groceryShop: Location;
    createdBy:  typeof Buyer; 
    destination: Location;
    items: Item[];
    selectedBid: Bid | null; // Allow null if no bid is selected
    bids: Bid[];
}

const orderSchema = new Schema<Order>(
    {
        status: { type: String, enum: Object.values(OrderStatus), required: true },
        creationDate: { type: Date, required: true },
        latestDeliveryDate: { type: Date, required: false },
        earliestDeliveryDate: { type: Date, required: false },
        groceryShop: { type: Schema.Types.Mixed, required: false },
        createdBy: { type: Schema.Types.ObjectId,ref: Buyer, required: true },
        destination: { type: Schema.Types.Mixed, required: true },
        items: { type: [itemSchema], required: true },
        groceryBill: {type: Schema.Types.Mixed, required: false},
        selectedBid: {
            type: bidSchema,
            required: false,
            default: null,
          },
        bids: { type: [bidSchema],  default: null, required: false },
    },
);

const OrderModel = mongoose.model<Order>('Order', orderSchema);

export {OrderModel}
