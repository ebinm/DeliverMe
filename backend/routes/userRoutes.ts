import express from "express";
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {findBuyerById} from "../controllers/buyerController";
import {findShopperById} from "../controllers/shopperController";
import {findBidOrdersByShopper, findOrdersByBuyer, findOrdersByShopper, order} from "../controllers/orderController";
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
        console.log(e)
        next(e.message)
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
        console.log(e)
        next(e.message)
    }
})

router.get("/bidOrders", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json({msg: "This call is only for shoppers"})
        } else {
            res.json(await findBidOrdersByShopper(req.customerId))
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.put("/bid", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json({msg: "This call is only for shoppers"})
        } else {
            res.json(await bidOnOrder(req.customerId, req.body.orderId, req.body.bid))
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.post("/order", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json(await order(req.customerId, req.body))
        } else {
            res.json({msg: "This call is only for buyers"})
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.put("/selectBid", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json(await selectBid(req.customerId, req.body.bidId))
        } else {
            res.json({msg: "This call is only for buyers"})
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})



export default router;