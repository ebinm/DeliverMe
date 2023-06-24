/**
 * This file only contains helper functions for the shopper and buyer controller
 */


import {Buyer, Shopper} from "../models/customer";


export async function clearNotificationsById(model: typeof Buyer | typeof Shopper, id: string, notificationId?: string) {
    if (notificationId === undefined) {
        return model.findByIdAndUpdate(id, {notifications: []});
    } else {
        await model.findByIdAndUpdate(id, {
            "$pull": {
                notifications: {
                    _id: notificationId
                }
            }
        });
    }
}

