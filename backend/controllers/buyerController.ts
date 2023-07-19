import {Buyer, Customer, Typed} from "../models/customer";
import {clearNotificationsById} from "./userController";


export async function findBuyerById(id: string): Promise<Customer & Typed> {
    const buyer = await Buyer.findById(id)
        .select("-password -__v")

    if (!buyer) {
        return null;
    } else {
        return {
            type: "BUYER",
            ...buyer.toJSON()
        }
    }

}

export async function updateBuyer(buyerId: string, buyer: Partial<Customer>) {

    const newBuyer = await Buyer.findByIdAndUpdate(buyerId, { $set: buyer }, {
        new: true,
    }).select("-__v -profilePicture -notifications");

    return {
        type: "Buyer",
        ...newBuyer.toJSON()
    }

}

export async function findBuyerProfilePicture(buyerId: string): Promise<string | undefined>{
    return (await Buyer.findById(buyerId).select("profilePicture"))?.profilePicture
}

export async function clearNotificationsForBuyerById(id: string, notificationId?: string): Promise<void> {
    await clearNotificationsById(Buyer, id, notificationId)
}



