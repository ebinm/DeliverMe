import {Customer, Shopper, Typed} from "../models/customer";
import {clearNotificationsById} from "./userController";


export async function findShopperById(id: string): Promise<Customer & Typed> {
    const shopper = await Shopper.findById(id)
        .select("-password -__v")

    if (!shopper) {
        return null;
    } else {
        return {
            type: "SHOPPER",
            ...shopper.toJSON()
        }
    }
}

export async function updateShopper(shopperId: string, shopper: Partial<Customer>) {

    const newShopper = await Shopper.findByIdAndUpdate(shopperId, { $set: shopper }, {
        new: true,
    });
    return {
        type: "SHOPPER",
        ...newShopper.toJSON()
    }

}

export async function clearNotificationsForShopperById(id: string, notificationId?: string) {
    await clearNotificationsById(Shopper, id, notificationId)
}