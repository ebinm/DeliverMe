import express from 'express';
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {
    changeOrder,
    changeStatus,
    getOpenOrders,
    getOrderById,
    getOrdersForBuyer,
    getOrdersForShopper,
    order,
    removeOrder
} from "../controllers/orderController";
import {bidOnOrder, selectBid} from "../controllers/bidController";

const
    router = express.Router();

router.get("/", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json(await getOrdersForBuyer(req.customerId))
        } else {
            res.json(await getOrdersForShopper(req.customerId))
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.get("/open", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getOpenOrders())

    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.get("/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getOrderById(req.params.id));
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.post("/", authenticated, async (req: AuthenticatedRequest, res, next) => {
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

router.put("/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json(await changeOrder(req.customerId, req.params.id, req.body))
        } else {
            res.json({msg: "This call is only for buyers"})
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.delete("/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json(await removeOrder(req.customerId, req.params.id))
        } else {
            res.json({msg: "This call is only for buyers"})
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.put("/:id/bid", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json({msg: "This call is only for shoppers"})
        } else {
            res.json(await bidOnOrder(req.customerId, req.params.id, req.body))
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.put("/:id/selectBid", authenticated, async (req: AuthenticatedRequest, res, next) => {
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

router.put("/:id/changeStatus", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json(await changeStatus(req.customerId, req.params.id, req.body.status))
        } else {
            res.json({msg: "This call is only for buyers"})
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

export default router;
