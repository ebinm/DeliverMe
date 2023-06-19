import {Buyer, Customer, Typed} from "../models/customer";


export async function findBuyerById(id: string): Promise<Customer & Typed> {
    const buyer = await Buyer.findById(id)
        .select("-password -__v")
    return {
        type: "BUYER",
        ...buyer.toJSON()
    }
}



