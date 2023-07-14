import express from 'express';
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {
    changeOrder,
    getOpenOrders,
    getOrderById,
    getOrdersForBuyer,
    getOrdersForShopper,
    order,
    removeOrder, sendMessage, uploadReceipt
} from "../controllers/orderController";
import {bidOnOrder, selectBid} from "../controllers/bidController";
import {rateBuyer, rateShopper} from "../controllers/reviewController";
import {performCheckout, capturePayment} from '../controllers/payController';

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
        res.json(await getOpenOrders(req.customerId))
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.put("/:id/receipt", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await uploadReceipt(req.customerId, req.params.id, req.body))
    } catch (e) {
        console.warn(e)
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


router.post("/:id/chat", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        console.time("Initial Call")
        const {content} = req.body
        res.status(200).json(await sendMessage(req.customerId, req.customerType, req.params.id, content))
        console.time("Response")
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.post("/:id/checkout", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        const order = await performCheckout(req.customerId, req.params.id);

        if (order) {
            res.json(order);
        } else {
            res.status(500).json({error: "Failed to create PayPal order"});
        }

    } catch (e) {
        console.log(e)
        next(e.message)
    }
});

router.post("/:id/capture", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        // Technically we should be able to just get the order via the transactionId but
        // we use the order id just to be sure.
        const captureData = await capturePayment(req.params.id, req.customerId, req.body.transactionId);
        res.json(captureData);
    } catch (e) {
        console.error(e)
        next(e.message)
    }
});


router.put("/:id/rate", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json(await rateShopper(req.customerId, req.params.id, req.body))
        } else {
            res.json(await rateBuyer(req.customerId, req.params.id, req.body))
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

export default router;
