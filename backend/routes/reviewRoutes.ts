import express from 'express';
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {
    createReview,
    deleteReview,
    getAllReviews,
    getReviewById,
    getReviewsForBuyerByOrder, getReviewsForShopperByOrder,
    getReviewsOfBuyer,
    getReviewsOfShopper,
    updateReview
} from "../controllers/reviewController";

const
    router = express.Router();

router.get("/", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getAllReviews())
    } catch (e) {
        next(e)
        console.log(e)
    }
})

router.get("/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getReviewById(req.params.id));
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.post("/", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await createReview(req.body.bid))
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.put("/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await updateReview(req.params.id, req.body))
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.delete("/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await deleteReview(req.params.id))
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.get("/buyer/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getReviewsOfBuyer(req.params.id));
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.get("/shopper/:id", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getReviewsOfShopper(req.params.id));
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.get("/buyer/:buyerId/order/:orderId", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getReviewsForBuyerByOrder(req.params.buyerId, req.params.orderId));
    } catch (e) {
        console.error(e)
        next(e.message)
    }
})

router.get("/shopper/:shopperId/order/:orderId", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        res.json(await getReviewsForShopperByOrder(req.params.shopperId, req.params.orderId));
    } catch (e) {
        console.error(e)
        next(e.message)
    }
})

export default router;