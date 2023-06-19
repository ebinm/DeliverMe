import express from 'express';
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {Schema} from "mongoose";
import {createOrder, deleteOrder, getAllOrders, getOrderById, updateOrder} from "../controllers/orderController";

const
    router = express.Router();


// router.get('/', async (req, res, next) => {
//     try {
//         await orderController.getAllOrders(req, res)
//     } catch (e) {
//         console.log(e)
//         next(e)
//     }
// });
//
// // TODO: Bring in same form as in buyerRoutes.ts
// router.get('/:id', orderController.getOrderById);
// router.post('/', orderController.createOrder);
// router.put('/:id', orderController.updateOrder);
// router.delete('/:id', orderController.deleteOrder);

router.get("/", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getAllOrders())
    } catch (e) {
        next(e)
    }
})

router.get("/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getOrderById(req.params.id));
    } catch (e) {
        next(e)
    }
})

router.post("/", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await createOrder(req.body))
    } catch (e) {
        next(e)
    }
})

router.put("/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await updateOrder(req.params.id, req.body))
    } catch (e) {
        next(e)
    }
})

router.delete("/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await deleteOrder(req.params.id))
    } catch (e) {
        next(e)
    }
})

export default router;
