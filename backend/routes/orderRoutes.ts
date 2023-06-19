import express from 'express';
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {createOrder, deleteOrder, getAllOrders, getOrderById, updateOrder} from "../controllers/orderController";

const
    router = express.Router();

router.get("/", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getAllOrders())
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
        res.json(await createOrder(req.body))
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.put("/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await updateOrder(req.params.id, req.body))
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.delete("/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await deleteOrder(req.params.id))
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

export default router;
