import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv'
import mongoose from "mongoose";
import {WebSocketServer} from "ws";
import * as http from "http";
import {getMockNotification} from "./datamock/notifications";
import {api} from "./api";

dotenv.config();
console.log("MongoDB URL: ", process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected to MongoDB"));

const PORT = process.env.PORT || 8443;


let server: http.Server | https.Server | undefined

try {
    const privateKey = fs.readFileSync('./frontend/.cert/deliver.me.key', 'utf8');
    const certificate = fs.readFileSync('./frontend/.cert/deliver.me.crt', 'utf8');
    const credentials = {key: privateKey, cert: certificate};

    server = https.createServer(credentials, api);
} catch (e) {
    server = http.createServer(api)
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

