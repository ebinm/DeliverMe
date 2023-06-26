
import {Order, OrderModel, OrderStatus} from '../models/order';
import {getOrderByBid, getOrderById, updateOrder} from "./orderController";
import {Bid} from "../models/bid";
import mongoose, {Types} from "mongoose";
import {notificationService} from "../index";
import {NotificationType} from "../models/notification";
import {Review, ReviewSchema} from "../models/review";
import {Shopper} from "../models/customer";
import {findShopperById} from "./shopperController";
import {findBuyerById, updateBuyer} from "./buyerController";

export async function rateBuyer(shopperId: string, buyerId: string, review: Review): Promise<Order> {

    /*
    const buyer = await findBuyerById(buyerId)

    if (!buyer) {
        throw new Error("Buyer with buyerId does not exist")
    }

    const order = await getOrderById(review.order.toString());

    if (!order) {
        throw new Error("Order with orderId does not exist")
    }

    review.createdBy = new Types.ObjectId(shopperId);
    review.creationTime = new Date()

    const oldReview = buyer.reviews.findIndex(p => (p.order.toString() === review.order.toString()));

    if (oldReview === -1) {
        buyer.reviews.push(review);
    } else {
        buyer.reviews[oldReview] = review;
    }

    return updateBuyer(buyerId, buyer);

     */
    return null;
}

/*
async function rateShopper(bidId: string): Promise<{ index: number, order: Order }> {
    const order = await getOrderByBid(bidId)

    if(!order) {
        throw new Error("bidId does not exist")
    }

    const bids = order.get("bids");
    const index = bids.findIndex(p => p._id.toString() === bidId);

    return {
        index: index,
        order: order
    };
}

 */
