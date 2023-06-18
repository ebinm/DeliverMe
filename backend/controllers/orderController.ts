import {Request, Response} from 'express';
import {Order, OrderModel} from '../models/order';
import {Bid} from "../models/bid";

// Controller methods for CRUD operations
// const getAllOrders = async (req: Request, res: Response) => {
//     const orders = await OrderModel.find();
//     res.json(orders);
// };
//
// const getOrderById = async (req: Request, res: Response) => {
//     try {
//         const order = await OrderModel.findById(req.params.id);
//         if (!order) {
//             return res.status(404).json({error: 'Order not found'});
//         }
//         res.json(order);
//     } catch (error) {
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// };
//
// const createOrder = async (req: Request, res: Response) => {
//     try {
//         const order = new OrderModel(req.body);
//         await order.save();
//         res.status(201).json(order);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// };
//
// const updateOrder = async (req: Request, res: Response) => {
//     try {
//         const order = await OrderModel.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//         });
//         if (!order) {
//             return res.status(404).json({error: 'Order not found'});
//         }
//         res.json(order);
//     } catch (error) {
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// };
//
// const deleteOrder = async (req: Request, res: Response) => {
//     try {
//         const order = await OrderModel.findByIdAndDelete(req.params.id);
//         if (!order) {
//             return res.status(404).json({error: 'Order not found'});
//         }
//         res.json({message: 'Order deleted successfully'});
//     } catch (error) {
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// };

export async function getAllOrders(): Promise<Order[]> {
    const orders = await OrderModel.find();
    return orders;
}

export async function getOrderById(id: string): Promise<Order> {
    const order = await OrderModel.findById(id);
    return order
}

export async function createOrder(order: Order) {
    const orderModel = new OrderModel(order);
    const savedOrder = await orderModel.save();
    return savedOrder;
}

export async function updateOrder(id: string, order: Order) {
    const updatedOrder = await OrderModel.findByIdAndUpdate(id, order, {
        new: true,
    });
    return updatedOrder;
}

export async function deleteOrder(id: string) {
    const deletedOrder = await OrderModel.findByIdAndDelete(id);
    return deletedOrder;
}

export async function findOrdersByBuyer(id: number): Promise<Order[]> {
    const orders = await OrderModel.find()
        .where("createdBy").equals(id);
    return orders;
}

export async function findOrdersByShopper(id: number): Promise<Order[]> {
    const orders = await OrderModel.find()
        .where("selectedBid.createdBy").equals(id);
    return orders;
}

export async function findBidOrdersByShopper(id: number): Promise<Order> {
    const order = await OrderModel.findByIdAndDelete(id);
    return order;
}
//
// export async function bidOnOrder(id: number, bid: Bid): Promise<Order> {
//     const order = await OrderModel.findByIdAndDelete(id);
//     return order;
// }

export default {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};
