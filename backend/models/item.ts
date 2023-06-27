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
      unit: { type: String, required: false },
      brandName: { type: String, required: false },
      ifItemUnavailable: { type: String, required: true },
      note: { type: String, required: false },
    }
  );


export {Item, itemSchema}