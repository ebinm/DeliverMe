import express from "express";
import {login, signup} from "../controllers/authController";
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {rateBuyer} from "../controllers/reviewController";


const router = express.Router();

router.post("/signup", async (req, res, next) => {
    try {
        await signup(req, res, "BUYER")
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})



router.post("/login", async (req, res, next) => {
    try {
        await login(req, res, "BUYER")
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.put("/:id/review", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json({msg: "This call is only for shoppers"})
        } else {
            res.json(await rateBuyer(req.customerId, req.params.id, req.body))
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})


export default router;