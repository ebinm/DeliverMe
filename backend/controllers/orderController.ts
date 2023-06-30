import {Order, OrderModel, OrderStatus} from '../models/order';
import {Receipt} from "../models/receipt";
import {notificationService} from "../index";
import {NotificationType} from "../models/notification";
import {Message} from "../models/message";
import {CustomerType} from "../models/customer";

export async function getAllOrders(): Promise<Order[]> {

    return OrderModel.find()

}

export async function getOrdersForBuyer(buyerId: string): Promise<Order[]> {
    return OrderModel.find({"createdBy": buyerId})
        .populate({path: "bids.createdBy", select: "firstName lastName avgRating profilePicture"})
        .populate({path: "selectedBid.createdBy", select: "firstName lastName avgRating profilePicture"})
        .select("-groceryBill")
        .sort({creationDate: -1});
}

export async function getOrdersForShopper(shopperId: string) {
    const orders = await OrderModel.find({
        "$or": [
            {"status": OrderStatus.Open, "bids": {"$elemMatch": {"createdBy": shopperId}}},
            {"selectedBid.createdBy": shopperId}
        ]
    })
        .populate({path: "createdBy", select: "firstName lastName _id profilePicture"})
        .populate({path: "bids.createdBy", select: "firstName lastName avgRating profilePicture"})
        .populate({path: "selectedBid.createdBy", select: "firstName lastName avgRating profilePicture"})
        .select("-groceryBill")
        .sort({creationDate: -1});


    // TODO figure out how to do this in the query
    orders.forEach(order => {
        // @ts-ignore
        order.bids = order.bids.filter(bid => bid.createdBy._id = shopperId)
    })

    return orders
}


export async function sendMessage(customerId: string, senderType: CustomerType, orderId: string, messageContent: string) {
    if (typeof messageContent !== "string") {
        throw Error("Message content must be a string")
    }

    const order = await OrderModel.findById(orderId)

    if(customerId === undefined || (customerId !== order.createdBy.toString() && customerId !== order.selectedBid.createdBy.toString())){
        throw Error(`The user with id ${customerId} is not authorized to send messages for the order with id ${orderId}.`)
    }

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
    notificationService.notifyBuyerById(order.createdBy, {
        msg: "You order has been completed",
        orderId: order._id,
        date: new Date(),
        type: NotificationType.PaymentRequired
    })

    return order.save()
}

export async function getOpenOrders(shopperId: string): Promise<Order[]> {

    return OrderModel.aggregate().match({
        "status": "Open"
    }).lookup({
        from: "buyers", localField: "createdBy",
        foreignField: "_id", as: "createdBy"
    }).addFields({
        createdBy: {$arrayElemAt: ["$createdBy", 0]} // extracts user from list
    }).project({
        "createdBy.password": 0
    }).addFields({
        "bids": {
            "$filter": {
                "input": "$bids",
                "as": "bids",
                "cond": {"createdBy": shopperId}
            }
        }
    });

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
        new Error("Order with orderId does not exist")
    } else if (oldOrder.createdBy.toString() !== buyerId.toString()) {
        new Error("You are not allowed to change this order")
    } else if (order.createdBy.toString() !== buyerId.toString()) {
        throw new Error("Order is unsupported: createdBy is not equal to customerId")
    } else {
        return updateOrder(orderId, order);
    }

}

export async function removeOrder(buyerId: string, orderId: string) {

    const oldOrder = await getOrderById(orderId)

    if (!oldOrder) {
        new Error("Order with orderId does not exist")
    } else if (oldOrder.createdBy.toString() !== buyerId.toString()) {
        new Error("You are not allowed to delete this order")
    } else {
        return deleteOrder(orderId);
    }

}

export async function changeStatus(buyerId: string, orderId: string, status: string) {

    const order = await getOrderById(orderId)

    if (!order) {
        new Error("Order with orderId does not exist")
    } else if (order.createdBy.toString() !== buyerId.toString()) {
        new Error("You are not allowed to change this order")
    } else {
        switch (status) {
            case "Open":
                order.status = OrderStatus.Open;
                break
            case "In Delivery":
                order.status = OrderStatus.InDelivery;
                break
            case "In Payment":
                order.status = OrderStatus.InPayment;
                break
            case "Finished":
                order.status = OrderStatus.Finished;
                break
            default:
                throw new Error("Order status is not valid")
        }

        return updateOrder(orderId, order);
    }

}

export async function getOrderByBid(bidId: string) {
    return OrderModel
        .findOne({bids: {$elemMatch: {_id: bidId}}});

}
