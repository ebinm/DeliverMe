import express from "express";
import {login, signup} from "../controllers/authController";


const router = express.Router();

router.post("/signup", async (req, res, next) => {
    try {
        await signup(req, res, "BUYER")
    } catch (e) {
        next(e)
    }
})



router.post("/login", async (req, res, next) => {
    try {
        await login(req, res, "BUYER")
    } catch (e) {
        next(e)
    }
})

export default router;