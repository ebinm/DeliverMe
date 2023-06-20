import express from 'express';
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {createBid, deleteBid, getAllBids, getBidById, updateBid} from "../controllers/bidController";

const
    router = express.Router();

router.get("/", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getAllBids())
    } catch (e) {
        next(e)
        console.log(e)
    }
})

router.get("/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getBidById(req.params.id));
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.post("/", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await createBid(req.body.orderId, req.body.bid))
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.put("/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await updateBid(req.params.id, req.body))
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.delete("/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await deleteBid(req.params.id))
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})
export default router;