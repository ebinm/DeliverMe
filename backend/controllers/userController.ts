import {Buyer, Customer, Shopper, Typed, UserNotification} from "../models/customer";


export async function findBuyerById(id: number): Promise<Customer & Typed> {
    const buyer = await Buyer.findById(id)
        .select("-password -__v")
    return {
        type: "BUYER",
        ...buyer.toJSON()
    }
}

export async function findShopperById(id: number): Promise<Customer & Typed> {
    const shopper = await Shopper.findById(id)
        .select("-password -__v")
    return {
        type: "SHOPPER",
        ...shopper.toJSON()
    }
}


export async function findNotificationsForShopperById(id: number): Promise<UserNotification[]> {
    return (await Shopper.findById(id).select({notifications: 1, _id: 0})).notifications || []
}

export async function findNotificationsForBuyerById(id: number): Promise<UserNotification[]> {
    return (await Buyer.findById(id).select({notifications: 1, _id: 0})).notifications || []
}

export async function clearNotificationsForBuyerById(id: number) {
    return Buyer.findByIdAndUpdate(id, {notifications: []});
}

export async function clearNotificationsForShopperById(id: number) {
    return Shopper.findByIdAndUpdate(id, {notifications: []});
}