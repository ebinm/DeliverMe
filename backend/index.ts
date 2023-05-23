import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv'
import express from "express"
import {signup, login} from "./services/authService";
import {Buyer} from "./models/customerType";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 8443;

const privateKey = fs.readFileSync('./frontend/.cert/deliver.me.key', 'utf8');
const certificate = fs.readFileSync('./frontend/.cert/deliver.me.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

app.get("/", async (req, res) => {
    return res.send("hi")
})

app.post("/personal-shopper/signup", async (req, res) => {
    await signup(req, res, "SHOPPER")
})

app.post("/buyer/signup", async (req, res) => {
    await signup(req, res, "BUYER")
})

app.post("/buyer/login", async (req, res) => {
    await login(req, res, Buyer)
})

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => console.log(`Listening on port: ${PORT}.`));
