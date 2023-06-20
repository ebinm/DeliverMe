import express from "express";
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {findBuyerById} from "../controllers/buyerController";
import {findShopperById} from "../controllers/shopperController";
import {findBidOrdersByShopper, findOrdersByBuyer, findOrdersByShopper} from "../controllers/orderController";


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



export default router;