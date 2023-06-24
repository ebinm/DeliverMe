import {Customer, Shopper, Typed} from "../models/customer";
import {clearNotificationsById} from "./userController";


export async function findShopperById(id: string): Promise<Customer & Typed> {
    const shopper = await Shopper.findById(id)
        .select("-password -__v")
    return {
        type: "SHOPPER",
        ...shopper.toJSON()
    }
}

export async function clearNotificationsForShopperById(id: string, notificationId?: string) {
    await clearNotificationsById(Shopper, id, notificationId)
}