import { Schema } from 'mongoose';


type Payment = {
    // _id: Schema.Types.ObjectId; // automatically created by MongoDB
    amount: number;
    fee: number;
    costCurrency: string;
    
}

const paymentSchema = new Schema<Payment>(
    {
      amount: { type: Number, required: true },
      fee: {type: Number, required: true},
      costCurrency: {type: String, required: true}

     }
  );


export {Payment, paymentSchema}