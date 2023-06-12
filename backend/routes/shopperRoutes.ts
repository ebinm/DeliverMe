import express from "express";
import {login, signup} from "../controllers/authController";
import {api} from "../api";


const router = express.Router();

router.post("/api/shopper/signup", async (req, res, next) => {
    try {
        await signup(req, res, "SHOPPER")
    } catch (e) {
        next(e)
    }
})

api.post("/api/shopper/login", async (req, res, next) => {
    try {
        await login(req, res, "SHOPPER")
    } catch (e) {
        next(e)
    }
})

export default router;