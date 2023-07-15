import {Schema} from "mongoose";


type Receipt = {
    image: string,
    costAmount: number,
    costCurrency: string
}


const receiptSchema = new Schema<Receipt>(
    {
        image:  { type: String, required: true },
        costAmount:  { type: Number, required: true },
        costCurrency:  { type: String, required: true },
    }
);

export {Receipt, receiptSchema}