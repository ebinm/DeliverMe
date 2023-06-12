import express from "express";
import cookieParser from "cookie-parser";
import {login, signup} from "./services/authService";
import {authenticated, AuthenticatedRequest} from "./middleware/auth";
import {findBuyerById, findShopperById} from "./services/userService";
import cors from "cors"

export const api = express();
api.use(express.json());
api.use(cookieParser());

// TODO I think this is only required in dev mode
// TODO configure origin correctly
const corsWhitelist = ['http://localhost:3000', 'https://localhost:3000']

api.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (corsWhitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
}));


api.post("/api/shopper/signup", async (req, res, next) => {
    try {
        await signup(req, res, "SHOPPER")
    } catch (e) {
        next(e)
    }
})

api.post("/api/buyer/signup", async (req, res, next) => {
    try {
        await signup(req, res, "BUYER")
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

api.post("/api/buyer/login", async (req, res, next) => {
    try {
        await login(req, res, "BUYER")
    } catch (e) {
        next(e)
    }
})

api.get("/api/me", authenticated, async (req: AuthenticatedRequest, res, next) => {
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

api.use((err, req, res, next) => {
    res.status(500).json({msg: err})
})

module.exports(api);