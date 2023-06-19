import mongoose, { Document, Schema } from 'mongoose';
import {Buyer, Shopper} from './customer';
import { Item, itemSchema } from './item';
import { Bid, BidModel, bidSchema } from './bid';

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
    creationDate: Date;
    latestDeliveryDate: Date;
    earliestDeliveryDate: Date;
    totalCostOfItems: number;
    totalCostOfOrder: number;
    groceryShop: Location;
    createdBy:  typeof Buyer; 
    destination: Location;
    items: Item[];
    selectedBid: Schema.Types.ObjectId | null; // Allow null if no bid is selected
    bids: Bid[];
}

const orderSchema = new Schema<Order>(
    {
        status: { type: String, enum: Object.values(OrderStatus), required: true },
        creationDate: { type: Date, required: true },
        latestDeliveryDate: { type: Date, required: true },
        earliestDeliveryDate: { type: Date, required: true },
        totalCostOfItems: { type: Number, required: true },
        totalCostOfOrder: { type: Number, required: true },
        groceryShop: { type: Schema.Types.Mixed, required: false },
        createdBy: { type: Schema.Types.ObjectId,ref: Buyer, required: true },
        destination: { type: Schema.Types.Mixed, required: true },
        items: { type: [itemSchema], required: true },
        selectedBid: {
            type: Schema.Types.ObjectId,
            required: false,
            ref: BidModel, 
            default: null,
            validate: {
              validator: async function (bidId: Schema.Types.ObjectId) {
                if (!bidId) {
                  // Allow null value
                  return true;
                }
                const bidCount = await BidModel.countDocuments({ _id: bidId }).exec();
                return bidCount > 0;
              },
              message: 'Invalid bid ID',
            },
          },
        bids: { type: [bidSchema],  default: null, required: false },
    },
    { timestamps: true }
);

const OrderModel = mongoose.model<Order>('Order', orderSchema);

export {OrderModel}
