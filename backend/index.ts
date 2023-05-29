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
import {WebSocketServer} from "ws";
import * as http from "http";
import {getMockNotification} from "./datamock/notifications";

dotenv.config()
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected to MongoDB"))

const app = express();
const PORT = process.env.PORT || 8443;

app.use(express.json());
app.use(cookieParser());

// TODO I think this is only required in dev mode
// TODO configure origin correctly
const corsWhitelist = ['http://localhost:3000', 'https://localhost:3000']

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (corsWhitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
}));

app.post("/api/shopper/signup", async (req, res, next) => {
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

app.post("/api/shopper/login", async (req, res, next) => {
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

let server: http.Server | https.Server | undefined

try {
    const privateKey = fs.readFileSync('./frontend/.cert/deliver.me.key', 'utf8');
    const certificate = fs.readFileSync('./frontend/.cert/deliver.me.crt', 'utf8');
    const credentials = {key: privateKey, cert: certificate};

    server = https.createServer(credentials, app);
} catch (e) {
    server = http.createServer(app)
}


const wss = new WebSocketServer({server})




wss.on("connection", (ws) => {
    const tm = setInterval(() => {
        ws.send(JSON.stringify(getMockNotification()))
    }, 8000)

    ws.on("error", () => {
        clearTimeout(tm)
    })
})


server.listen(PORT, () => console.log(`Listening on port: ${PORT}.`));

