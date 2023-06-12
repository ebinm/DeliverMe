import express from "express";
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {findBuyerById, findShopperById} from "../controllers/userController";


const router = express.Router();

router.get("/api/me", authenticated, async (req: AuthenticatedRequest, res, next) => {
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

export default router;