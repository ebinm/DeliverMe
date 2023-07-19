import express from "express";
import {login, signup} from "../controllers/authController";
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {getReviewsOfCustomerTyped} from "../controllers/reviewController";
import {returnImage} from "../services/profilePictureService";
import {findShopperProfilePicture} from "../controllers/shopperController";


const router = express.Router();

router.post("/signup", async (req, res, next) => {
    try {
        await signup(req, res, "SHOPPER")
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.post("/login", async (req, res, next) => {
    try {
        await login(req, res, "SHOPPER")
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.get("/:id/reviews", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getReviewsOfCustomerTyped("Shopper", req.params.id));
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.get("/:id/profilePicture", async (req, res, next) => {
    try {
        const profilePicture = await findShopperProfilePicture(req.params.id)
        returnImage(res, profilePicture)
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

export default router;