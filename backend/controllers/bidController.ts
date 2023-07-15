import {Order, OrderModel, OrderStatus} from '../models/order';
import {getOrderByBid, getOrderById, updateOrder} from "./orderController";
import {Bid} from "../models/bid";
import mongoose from "mongoose";
import {notificationService} from "../index";
import {NotificationType} from "../models/notification";

export async function getAllBids(): Promise<Bid[]> {
    return OrderModel.aggregate().unwind("$bids").replaceRoot("bids");
}

export async function getBidById(bidId: string): Promise<Bid> {
    const id = new mongoose.Types.ObjectId(bidId);
    const resultBid = await OrderModel.aggregate().unwind("$bids").replaceRoot("bids").match({"_id": id});
    return resultBid[0];
}

export async function createBid(orderId: string, bid: Bid) {

    const order = await getOrderById(orderId);

    const oldBid = order.bids.findIndex(p => (p.createdBy.toString() === bid.createdBy.toString()));

    if (oldBid === -1) {
        throw new Error("Bid already exists for order");
    } else {
        order.bids[oldBid] = bid;
    }
    return updateOrder(orderId, order);

}

export async function updateBid(bidId: string, bid: Bid) {

    const bidInOrder = await getBidInOrder(bidId);

    const order = bidInOrder.order;
    order.bids[bidInOrder.index] = bid;
    return updateOrder(order._id, order);

}

export async function deleteBid(bidId: string) {

    const bidInOrder = await getBidInOrder(bidId);

    const order = bidInOrder.order;
    order.bids.splice(bidInOrder.index, 1);
    return updateOrder(order._id, order);

}

export async function bidOnOrder(shopperId: string, orderId: string, bid: Bid): Promise<Order> {

    if(typeof bid.moneyBid.amount !== "number" || bid.moneyBid.amount <= 0){
        throw new Error("The bid has a bad format")
    }

    bid.moneyBid.amount = Math.round(bid.moneyBid.amount * 100) / 100

    const order = await getOrderById(orderId);

    if (!order) {
        throw new Error("Order with orderId does not exist")
    }


    //@ts-ignore
    bid.createdBy = shopperId.toString()
    // TODO move the rate to some constants file
    bid.moneyBidWithFee = {
        amount: bid.moneyBid.amount * (1 + 0.3),
        currency: bid.moneyBid.currency
    }

    const oldBid = order.bids.findIndex(p => (p.createdBy.toString() === shopperId.toString()));

    if (oldBid === -1) {
        order.bids.push(bid);
    } else {
        order.bids[oldBid] = bid;
    }

    const updatedOrder = await updateOrder(orderId, order);

    // @ts-ignore
    notificationService.notifyBuyerById(order.createdBy._id.toString(), {
        orderId: order._id,
        type: NotificationType.BidPlacedOnOrder,
        msg: `A bid was placed on your order.`,
        date: new Date()
    })

    return updatedOrder

}

async function getBidInOrder(bidId: string): Promise<{ index: number, order: Order }> {
    const order = await getOrderByBid(bidId)

    if (!order) {
        throw new Error("bidId does not exist")
    }

    const bids = order.get("bids");
    const index = bids.findIndex(p => p._id.toString() === bidId);

    return {
        index: index,
        order: order
    };
}

export async function selectBid(buyerId: string, bidId: string): Promise<Order> {
    const bidInOrder = await getBidInOrder(bidId);
    const bid = bidInOrder.order.get("bids")[bidInOrder.index];
    const order = bidInOrder.order;

    if (order.createdBy.toString() !== buyerId.toString()) {
        throw new Error("Bid is unsupported: createdBy is not equal to customerId")
    } else {
        order.selectedBid = bid;
        order.status = OrderStatus.InDelivery

        await notificationService.notifyShopperById(bid.createdBy._id.toString(), {
            type: NotificationType.BidAccepted,
            orderId: order._id,
            date: new Date(),
            msg: "One of your bids has been accepted"
        })


        return updateOrder(order._id, order);
    }
}



