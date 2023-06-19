import {Order, OrderModel} from '../models/order';
import {getOrderById, updateOrder} from "./orderController";
import {Bid} from "../models/bid";

//TODO
export async function getAllBids(): Promise<Bid[]> {
    return OrderModel.aggregate().unwind("$bids").project({
        "_id": "$bids._id",
        "moneyBid": "$bids.moneyBid",
        "moneyBisWithFee": "$bids.moneyBidWithFee",
        "timeBid": "$bids.timeBid",
        "note": "§bids.note",
        "createdBy": "$bids.createdBy"
    });
}

//TODO
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

    const order = await getOrderById(orderId);

    if (bid.createdBy.toString() !== shopperId.toString()) {
        throw new Error("Bid is unsupported: createdBy is not equal to customerId")
    } else {

        const oldBid = order.bids.findIndex(p => (p.createdBy.toString() === shopperId.toString()));

        if (oldBid === -1) {
            order.bids.push(bid);
        } else {
            order.bids[oldBid] = bid;
        }
        return updateOrder(orderId, order);
    }
}

async function getOrderByBid(bidId: string) {
    return OrderModel
        .findOne({bids: {$elemMatch: {_id: bidId}}});

}

/*
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

 */

async function getBidandOrderByBid(bidId: string): Promise<{ bid: Bid, order: Order }> {
    const order = await getOrderByBid(bidId)

    const bids = order.get("bids");
    const index = bids.findIndex(p => p._id.toString() === bidId);
    console.log(index);

    return {
        bid: order.bids[index],
        order: order
    };
}

export async function selectBid(buyerId: number, bidId: string): Promise<Order> {
    const bidAndOrder = await getBidandOrderByBid(bidId);
    const bid = bidAndOrder.bid;
    const order = bidAndOrder.order;
    if (order.createdBy.toString() !== buyerId.toString()) {
        throw new Error("Bid is unsupported: createdBy is not equal to customerId")
    } else {
        order.selectedBid = bid;
        return updateOrder(order._id, order);
    }

}

