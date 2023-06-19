import {Request, Response} from 'express';
import {Order, OrderModel} from '../models/order';
import {Bid, BidModel, bidSchema} from "../models/bid";
import {updateOrder} from "./orderController";
import {Shopper} from "../models/customer";

export async function getAllBids(): Promise<Bid[]> {
    const bids = await OrderModel.aggregate().unwind("$bids").project({
        "_id": "$bids._id",
        "moneyBid": "$bids.moneyBid",
        "moneyBisWithFee": "$bids.moneyBidWithFee",
        "timeBid": "$bids.timeBid",
        "note": "§bids.note",
        "createdBy": "$bids.createdBy"
    })
    return bids;
}

export async function getBidById(id: string): Promise<Bid> {
    const bids = await OrderModel.aggregate().unwind("$bids").match({"$bids._id": id}).project({
        "_id": "$bids._id",
        "moneyBid": "$bids.moneyBid",
        "moneyBisWithFee": "$bids.moneyBidWithFee",
        "timeBid": "$bids.timeBid",
        "note": "§bids.note",
        "createdBy": "$bids.createdBy"
    })
    return bids[0];
}
export async function bidOnOrder(shopperId: number, orderId: string, bid: Bid): Promise<Order> {
    const order = await OrderModel.findById(orderId);
    if (!order || (bid.createdBy.toString() !== shopperId.toString())) {
        return null
    } else {
        let oldBid;
        for (let i = 0; i < order.bids.length; i++) {
            if (order.bids[i].createdBy.toString() === shopperId.toString()) {
                oldBid = i;
            }
        }

        if (oldBid == undefined) {
            order.bids.push(bid);
        } else {
            order.bids[oldBid] = bid;
        }
        return updateOrder(orderId, order);
    }
}

async function getOrderByBid(bidId: string) {
    const order = await OrderModel
        .findOne({bids: {$elemMatch: {_id: bidId}}})
    return order;
}

async function getBidById2(bidId: string): Promise<Bid> {
    const order = await getOrderByBid(bidId)
    const bids = order.get("bids");
    let resultBid;
    for (let i = 0; i < bids.length; i++) {
        if (bids[i]._id.toString() === bidId) {
            resultBid = bids[i]

        }
    }
    return resultBid;
}

async function getBidandOrderByBid(bidId: string): Promise<{ bid: Bid, order: Order }> {
    const order = await getOrderByBid(bidId)
    const bids = order.get("bids");
    let resultBid: Bid;
    for (let i = 0; i < bids.length; i++) {
        if (bids[i]._id.toString() === bidId) {
            resultBid = bids[i]

        }
    }
    return {
        bid: resultBid,
        order: order
    };
}

export async function selectBid(buyerId: number, bidId: string): Promise<Order> {
    const bidAndOrder = await getBidandOrderByBid(bidId);
    const bid = bidAndOrder.bid;
    const order = bidAndOrder.order;
    if (!bidAndOrder || (order.createdBy.toString() !== buyerId.toString())) {
        return order
    } else {
        order.selectedBid = bid;
        return updateOrder(order._id, order);
    }

}

