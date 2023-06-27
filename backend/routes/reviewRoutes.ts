import express from 'express';
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {createReview, deleteReview, getAllReviews, getReviewById, updateReview} from "../controllers/reviewController";

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

export default router;