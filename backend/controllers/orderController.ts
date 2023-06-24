import {Order, OrderModel, OrderStatus} from '../models/order';

export async function getAllOrders(): Promise<Order[]> {

    return OrderModel.find()

}

export async function getOrdersForBuyer(buyerId: string): Promise<Order[]> {
    return OrderModel.find({"createdBy": buyerId})
        .populate({path: "bids.createdBy", select: "firstName lastName"});
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


