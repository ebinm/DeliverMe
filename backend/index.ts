import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv'
import mongoose from "mongoose";
import * as http from "http";
import api from "./api";
import io from "socket.io"
import {createNotificationService} from "./services/notificationService";

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


const socketIOSerer = new io.Server(server,
    {
        cors: {
            origin: "https://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        },
    });
const notificationService = createNotificationService(socketIOSerer)

server.listen(PORT, () => console.log(`Listening on port: ${PORT}.`));

export {notificationService}
