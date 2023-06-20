import {Customer, Shopper, Typed} from "../models/customer";


export async function findShopperById(id: number): Promise<Customer & Typed> {
    const shopper = await Shopper.findById(id)
        .select("-password -__v")
    return {
        type: "SHOPPER",
        ...shopper.toJSON()
    }
}
