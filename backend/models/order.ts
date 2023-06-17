import mongoose, { Document, Schema } from 'mongoose';
import {Buyer, Shopper} from './customer';

type Location = {
    _id: Schema.Types.ObjectId;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    formattedAddress: string;
}

type Item = {
    // _id: Schema.Types.ObjectId; // automatically created by MongoDB
    name: string;
    quantity: number;
    unit: string;
    brandName: string;
    ifItemUnavailable: string;
    note: string;
}

const itemSchema = new Schema<Item>(
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      unit: { type: String, required: true },
      brandName: { type: String, required: true },
      ifItemUnavailable: { type: String, required: true },
      note: { type: String, required: true },
    }
  );

type Bid = {
    // _id: Schema.Types.ObjectId; // automatically created by MongoDB
    moneyBid: {
        currency: string;
        amount: number;
    },
    moneyBidWithFee: {
        currency: string;
        amount: number;
    },
    timeBid: Date;
    note: string;
    createdBy: typeof Shopper; 
}

const bidSchema = new Schema<Bid>(
    {
      moneyBid: {
        currency: { type: String, required: true },
        amount: { type: Number, required: true },
      },
      moneyBidWithFee: {
        currency: { type: String, required: true },
        amount: { type: Number, required: true },
      },
      timeBid: { type: Date, required: true },
      note: { type: String, required: true },
      createdBy: { type: Schema.Types.ObjectId, ref: Shopper, required: true },
    }
  );

// Create the Bid model
const BidModel = mongoose.model<Bid>('Bid', bidSchema);


export interface Order extends Document {
    //_id: Schema.Types.ObjectId;   // automatically created by MongoDB
    status: string;
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
        status: { type: String, required: true },
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
        bids: { type: [bidSchema], required: false  },
    },
    { timestamps: true }
);

const OrderModel = mongoose.model<Order>('Order', orderSchema);

export default OrderModel;
