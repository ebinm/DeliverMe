import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv'
import express from "express"
import {signup, login} from "./services/authService";
import {Buyer, Shopper} from "./models/customerType";
import {authenticated} from "./middleware/auth";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

dotenv.config()
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected to MongoDB"))

const app = express();
const PORT = process.env.PORT || 8443;

const privateKey = fs.readFileSync('./frontend/.cert/deliver.me.key', 'utf8');
const certificate = fs.readFileSync('./frontend/.cert/deliver.me.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

app.use(express.json());
app.use(cookieParser());

app.get("/auth", authenticated, async (req, res) => {
    return res.send("hi")
})

app.post("/personal-shopper/signup", async (req, res) => {
    await signup(req, res, Shopper)
})

app.post("/buyer/signup", async (req, res) => {
    await signup(req, res, Buyer)
})

app.post("/personal-shopper/login", async (req, res) => {
    await login(req, res, Shopper)
})


app.post("/buyer/login", async (req, res) => {
    await login(req, res, Buyer)
})

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => console.log(`Listening on port: ${PORT}.`));
