import {Buyer, Customer, Shopper, Typed} from "../models/customer";


export async function findBuyerById(id: number): Promise<Customer & Typed> {
    const buyer = await Buyer.findById(id)
        .select("-password")
    return {
        type: "BUYER",
        ...buyer.toJSON()
    }
}


export async function findShopperById(id: number): Promise<Customer & Typed> {
    const shopper = await Shopper.findById(id)
        .select("-password")
    return {
        type: "SHOPPER",
        ...shopper.toJSON()
    }
}