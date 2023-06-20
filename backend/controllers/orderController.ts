import {Order, OrderModel} from '../models/order';

export async function getAllOrders(): Promise<Order[]> {

    return OrderModel.find();

}

export async function getOpenOrders(): Promise<Order[]> {

        return OrderModel.aggregate().lookup({
            from: "buyers", localField: "createdBy",
            foreignField: "_id", as: "createdBy"
        }).addFields({
            createdBy: {$arrayElemAt: ["$createdBy", 0]} // extracts user from list
        }).project({
            "createdBy.password": 0
        }).match({"status": "Open"});

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

export async function findOrdersByBuyer(buyerId: number): Promise<Order[]> {

    return OrderModel.find()
        .where("createdBy").equals(buyerId);

}

export async function findOrdersByShopper(shopperId: number): Promise<Order[]> {

    return OrderModel.find()
        .where("selectedBid.createdBy").equals(shopperId);

}

export async function findBidOrdersByShopper(shopperId: number): Promise<Order[]> {

    return OrderModel
        .find({bids: {$elemMatch: {createdBy: shopperId}}});

}

export async function order(buyerId: number, order: Order) {

    if(order.createdBy.toString() !== buyerId.toString()) {
        throw new Error("Order is unsupported: createdBy is not equal to customerId")
    } else {
        return createOrder(order);
    }

}

export async function changeOrder(buyerId: number, orderId: string, order: Order) {

    const oldOrder = await getOrderById(orderId)

    if(!oldOrder) {
        new Error("Order with orderId does not exist")
    } else if (oldOrder.createdBy.toString() !== buyerId.toString()) {
        new Error("You are not allowed to change this order")
    } else if(order.createdBy.toString() !== buyerId.toString()) {
        throw new Error("Order is unsupported: createdBy is not equal to customerId")
    } else {
        return updateOrder(orderId, order);
    }

}

export async function removeOrder(buyerId: number, orderId: string) {

    const oldOrder = await getOrderById(orderId)

    if(!oldOrder) {
        new Error("Order with orderId does not exist")
    } else if (oldOrder.createdBy.toString() !== buyerId.toString()) {
        new Error("You are not allowed to delete this order")
    } else {
        return deleteOrder(orderId);
    }

}

export async function getOrderByBid(bidId: string) {
    return OrderModel
        .findOne({bids: {$elemMatch: {_id: bidId}}});

}


