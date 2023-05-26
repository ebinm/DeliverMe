import {Buyer, Customer, Shopper, Typed} from "../models/customer";


export async function findBuyerById(id: number): Promise<Customer & Typed> {
    const buyer = await Buyer.findById(id)
        .select("-password -__v -_id")
    return {
        type: "BUYER",
        ...buyer.toJSON()
    }
}


export async function findShopperById(id: number): Promise<Customer & Typed> {
    const shopper = await Shopper.findById(id)
        .select("-password -__v -_id")
    return {
        type: "SHOPPER",
        ...shopper.toJSON()
    }
}