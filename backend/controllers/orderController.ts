import {Order, OrderModel, OrderStatus} from '../models/order';
import {Receipt} from "../models/receipt";
import {notificationService} from "../index";
import {NotificationType} from "../models/notification";
import {Message} from "../models/message";
import {CustomerType, Shopper} from "../models/customer";
import mongoose from "mongoose";
import {populateProfilePicture} from "../services/profilePictureService";

export async function getAllOrders(): Promise<Order[]> {

    return OrderModel.find()

}

export async function getOrdersForBuyer(buyerId: string): Promise<Order[]> {
    const orders = await OrderModel.find({"createdBy": buyerId})
        .populate({path: "bids.createdBy", select: "firstName lastName avgRating profilePicture email phoneNumber"})
        .populate({
            path: "selectedBid.createdBy",
            select: "firstName lastName avgRating email phoneNumber"
        })
        .select("-groceryBill")
        .sort({creationDate: -1});

    orders?.forEach(order => {
        order.bids?.forEach(bid =>
            //@ts-ignore
            populateProfilePicture("SHOPPER", bid.createdBy)
        )

        if (order.selectedBid) {
            //@ts-ignore
            populateProfilePicture("SHOPPER", order.selectedBid.createdBy)
        }
    })
    return orders
}

export async function getOrdersForShopper(shopperId: string) {
    const orders = await OrderModel.find({
        "$or": [
            {"status": OrderStatus.Open, "bids": {"$elemMatch": {"createdBy._id": shopperId}}},
            {"selectedBid.createdBy": shopperId}
        ]
    })
        .populate({path: "createdBy", select: "firstName lastName _id phoneNumber email"})
        .populate({path: "bids.createdBy", select: "firstName lastName avgRating email phoneNumber"})
        .populate({
            path: "selectedBid.createdBy",
            select: "firstName lastName avgRating email phoneNumber"
        })
        .select("-groceryBill")
        .sort({creationDate: -1});


    orders.forEach(order => {
        // @ts-ignore
        order.bids = order.bids.filter(bid => bid.createdBy._id === shopperId)

        //@ts-ignore
        populateProfilePicture("BUYER", order.createdBy)

        order.bids?.forEach(bid =>
            //@ts-ignore
            populateProfilePicture("BUYER", bid.createdBy)
        )

        if (order.selectedBid?.createdBy) {
            //@ts-ignore
            populateProfilePicture("SHOPPER", order.selectedBid.createdBy)
        }

    })

    return orders
}

export async function sendMessage(customerId: string, senderType: CustomerType, orderId: string, messageContent: string) {
    if (typeof messageContent !== "string") {
        throw Error("Message content must be a string")
    }

    const order = await OrderModel.findById(orderId)
        .select("-groceryBill")

    const message: Message = {
        orderId: orderId,
        content: messageContent,
        sender: senderType,
        created: new Date()
    }

    if (!order) {
        throw Error(`Could not find order with id ${orderId}`)
    }

    return await notificationService.sendChatMessage(order, message)
}


export async function uploadReceipt(customerId, orderId: string, receipt: Receipt) {
    const order = await OrderModel.findById(orderId)
    if (customerId !== order?.selectedBid?.createdBy?.toString()) {
        throw Error("Customer is not authorized to upload a receipt for this order.")
    }

    if (order.status !== OrderStatus.InDelivery) {
        throw Error("Order is not in the correct status for receipt upload.")
    }
    order.groceryBill = receipt
    order.status = OrderStatus.InPayment

    //@ts-ignore
    notificationService.notifyBuyerById(order.createdBy._id.toString(), {
        msg: "You order has been completed",
        orderId: order._id,
        date: new Date(),
        type: NotificationType.PaymentRequired
    })

    return order.save()
}

export async function getOpenOrders(shopperId: string): Promise<Order[]> {
    const shopperPromise = Shopper.findById(shopperId)
        .select("-password -notifications -__v -profilePicture")

    const orders = await OrderModel.aggregate().match({
        "status": "Open"
    }).lookup({
        from: "buyers", localField: "createdBy",
        foreignField: "_id", as: "createdBy",
    }).addFields({
        createdBy: {$arrayElemAt: ["$createdBy", 0]} // extracts user from list
    }).project({
        "createdBy.password": 0, "createdBy.notifications": 0, "createdBy.__v": 0, "createdBy.profilePicture": 0
    }).addFields({
        "bids": {
            "$filter": {
                "input": "$bids",
                "as": "bid",
                "cond": {
                    "$eq": ["$$bid.createdBy", new mongoose.Types.ObjectId(shopperId)]
                },
            }
        }
    })


    const shopper = await shopperPromise
    populateProfilePicture("SHOPPER", shopper)

    // Doing this in the query is non-trivial, so we do it separately
    // (we only select our own bids, so we can do this)
    orders.forEach(order => {
        populateProfilePicture("BUYER", order.createdBy)
        order.bids?.forEach(bid => {
            bid.createdBy = shopper
        })
    })

    return orders
}

export async function getOrderById(orderId: string): Promise<Order> {
    return OrderModel.findById(orderId);
}

export async function createOrder(order: Order) {

    const orderModel = new OrderModel(order);
    return await orderModel.save();

}

export async function updateOrder(orderId: string, order: Order) {

    return OrderModel.findByIdAndUpdate(orderId, order, {
        new: true,
    });

}

export async function deleteOrder(orderId: string) {

    return OrderModel.findByIdAndDelete(orderId);

}

export async function findOrdersByBuyer(buyerId: string): Promise<Order[]> {

    return OrderModel.find()
        .where("createdBy").equals(buyerId);

}

export async function findOrdersByShopper(shopperId: string): Promise<Order[]> {

    return OrderModel.find()
        .where("selectedBid.createdBy").equals(shopperId);

}

export async function findBidOrdersByShopper(shopperId: string): Promise<Order[]> {

    return OrderModel
        .find({bids: {$elemMatch: {createdBy: shopperId}}});

}

export async function order(buyerId: string, order: Order) {

    // @ts-ignore
    order.createdBy = buyerId
    order.status = OrderStatus.Open
    order.creationDate = new Date()
    order.selectedBid = null
    order.bids = []

    return createOrder(order);
}

export async function changeOrder(buyerId: string, orderId: string, order: Order) {

    const oldOrder = await getOrderById(orderId)

    if (!oldOrder) {
        throw new Error("Order with orderId does not exist")
    } else if (oldOrder.createdBy.toString() !== buyerId.toString()) {
        throw new Error("You are not allowed to change this order")
    } else if (order.createdBy.toString() !== buyerId.toString()) {
        throw new Error("Order is unsupported: createdBy is not equal to customerId")
    } else {
        return updateOrder(orderId, order);
    }
}

export async function removeOrder(buyerId: string, orderId: string) {

    const oldOrder = await getOrderById(orderId)

    if (!oldOrder) {
        throw new Error("Order with orderId does not exist")
    } else if (oldOrder.createdBy.toString() !== buyerId.toString()) {
        throw new Error("You are not allowed to delete this order")
    } else if (oldOrder.selectedBid) {
        throw new Error("You may not delete an order with a selected bid.")
    } else {
        return deleteOrder(orderId);
    }

}

export async function getOrderByBid(bidId: string) {
    return OrderModel
        .findOne({bids: {$elemMatch: {_id: bidId}}});

}
