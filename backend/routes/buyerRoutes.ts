import express from "express";
import {login, signup} from "../controllers/authController";


const router = express.Router();

router.post("/api/buyer/signup", async (req, res, next) => {
    try {
        await signup(req, res, "BUYER")
    } catch (e) {
        next(e)
    }
})



router.post("/api/buyer/login", async (req, res, next) => {
    try {
        await login(req, res, "BUYER")
    } catch (e) {
        next(e)
    }
})

export default router;