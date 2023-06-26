import {Buyer, Customer, Typed} from "../models/customer";
import {clearNotificationsById} from "./userController";
import {Order, OrderModel} from "../models/order";


export async function findBuyerById(id: string): Promise<Customer & Typed> {
    const buyer = await Buyer.findById(id)
        .select("-password -__v")
    return {
        type: "BUYER",
        ...buyer.toJSON()
    }
}

export async function updateBuyer(buyerId: string, buyer: Customer) {

    return Buyer.findByIdAndUpdate(buyerId, buyer, {
        new: true,
    });

}

export async function clearNotificationsForBuyerById(id: string, notificationId?: string): Promise<void> {
    await clearNotificationsById(Buyer, id, notificationId)
}



