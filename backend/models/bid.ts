
import {Shopper} from './customer';
import { Schema, Document } from 'mongoose';


interface Bid extends Document {
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
    createdBy: typeof Shopper
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
      createdBy: { type: Schema.Types.ObjectId, ref: Shopper, required: true }
    }
  );

export {Bid, bidSchema}