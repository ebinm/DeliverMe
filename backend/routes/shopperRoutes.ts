import express from "express";
import {login, signup} from "../controllers/authController";


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

export default router;