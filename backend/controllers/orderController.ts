import {Order, OrderModel} from '../models/order';
import {findBuyerById} from "./buyerController";

export async function getAllOrders(): Promise<Order[]> {

    return await OrderModel.find();

}

export async function getAllOrdersWithCreator(): Promise<Order[]> {

    const orders = await OrderModel.aggregate().lookup({from: "buyers", localField: "createdBy",
        foreignField: "_id", as: "createdBy"})
    let resultOrders;

    /*
    for (let i = 0; i < orders.length; i++) {

        orders[i].createdBy = findBuyerById(orders[i].createdBy.toString())
        resultOrders = resultOrders.push()
    }

     */
    return orders;

}

export async function getOrderById(orderId: string): Promise<Order> {
    return await OrderModel.findById(orderId)
}

export async function createOrder(order: Order) {

    const orderModel = new OrderModel(order);
    return await orderModel.save();

}

export async function updateOrder(orderId: string, order: Order) {

    return await OrderModel.findByIdAndUpdate(orderId, order, {
        new: true,
    });

}

export async function deleteOrder(orderId: string) {

    return await OrderModel.findByIdAndDelete(orderId);

}

export async function findOrdersByBuyer(buyerId: number): Promise<Order[]> {

    return await OrderModel.find()
        .where("createdBy").equals(buyerId);

}

export async function findOrdersByShopper(shopperId: number): Promise<Order[]> {

    return await OrderModel.find()
        .where("selectedBid.createdBy").equals(shopperId);

}

export async function findBidOrdersByShopper(shopperId: number): Promise<Order[]> {

    return await OrderModel
        .find({bids: {$elemMatch: {createdBy: shopperId}}});

}

export async function order(buyerId: number, order: Order) {

    if(order.createdBy.toString() !== buyerId.toString()) {
        throw new Error("Order is unsupported: createdBy is not equal to customerId")
    } else {
        return createOrder(order);
    }

}


