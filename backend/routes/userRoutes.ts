import express from "express";
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {findBuyerById} from "../controllers/buyerController";
import {findShopperById} from "../controllers/shopperController";
import {findBidOrdersByShopper, findOrdersByBuyer, findOrdersByShopper} from "../controllers/orderController";
import {bidOnOrder, selectBid} from "../controllers/bidController";


const router = express.Router();

router.get("", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json(await findBuyerById(req.customerId))
        } else {
            res.json(await findShopperById(req.customerId))
        }
    } catch (e) {
        next(e)
    }
})

router.get("/orders", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json(await findOrdersByBuyer(req.customerId))
        } else {
            res.json(await findOrdersByShopper(req.customerId))
        }
    } catch (e) {
        next(e)
    }
})

router.get("/bidOrders", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json("This call is only for shoppers")
        } else {
            res.json(await findBidOrdersByShopper(req.customerId))
        }
    } catch (e) {
        next(e)
    }
})

router.put("/bid", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json("This call is only for shoppers")
        } else {
            res.json(await bidOnOrder(req.customerId, req.body.orderId, req.body.bid))
        }
    } catch (e) {
        next(e)
    }
})

router.put("/selectBid", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json(await selectBid(req.customerId, req.body.bidId))
        } else {
            res.json("This call is only for buyers")
        }
    } catch (e) {
        next(e)
    }
})



export default router;