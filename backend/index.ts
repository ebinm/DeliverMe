import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv'
import express from "express"
import cors from "cors"
import {signup, login} from "./services/authService";
import {authenticated, AuthenticatedRequest} from "./middleware/auth";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import {findBuyerById, findShopperById} from "./services/userService";

dotenv.config()
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected to MongoDB"))

const app = express();
const PORT = process.env.PORT || 8443;

const privateKey = fs.readFileSync('./frontend/.cert/deliver.me.key', 'utf8');
const certificate = fs.readFileSync('./frontend/.cert/deliver.me.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

app.use(express.json());
app.use(cookieParser());

// TODO I think this is only required in dev mode
// TODO configure origon correctly
app.use(cors({
    credentials: true,
    origin: 'https://localhost:3000',

}));

app.post("/api/personal-shopper/signup", async (req, res, next) => {
    try {
        await signup(req, res, "SHOPPER")
    } catch (e) {
        next(e)
    }
})

app.post("/api/buyer/signup", async (req, res, next) => {
    try {
        await signup(req, res, "BUYER")
    } catch (e) {
        next(e)
    }
})

app.post("/api/personal-shopper/login", async (req, res, next) => {
    try {
        await login(req, res, "SHOPPER")
    } catch (e) {
        next(e)
    }
})

app.post("/api/buyer/login", async (req, res, next) => {
    try {
        await login(req, res, "BUYER")
    } catch (e) {
        next(e)
    }
})

app.get("/api/me", authenticated, async (req: AuthenticatedRequest, res, next) => {
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

app.use((err, req, res, next) => {
    res.status(500).json({msg: err})
})


const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => console.log(`Listening on port: ${PORT}.`));
