import { Schema } from 'mongoose';


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


export {Item, itemSchema}