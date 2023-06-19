import express from 'express';
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {Schema} from "mongoose";
import {getAllBids} from "../controllers/bidController";

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

export default router;