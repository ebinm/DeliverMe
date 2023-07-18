import express from "express";
import {login, signup} from "../controllers/authController";
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {getReviewsOfCustomerTyped} from "../controllers/reviewController";
import {findBuyerProfilePicture} from "../controllers/buyerController";
import {returnImage} from "../services/profilePictureService";


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

router.get("/:id/reviews", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getReviewsOfCustomerTyped("Buyer", req.params.id));
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})


router.get("/:id/profilePicture", async (req, res, next) => {
    try {
        const profilePicture = await findBuyerProfilePicture(req.params.id)
        returnImage(res, profilePicture)
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

export default router;