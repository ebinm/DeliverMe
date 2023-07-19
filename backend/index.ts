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

if (process.env.https === "true") {
    try {
        const privateKey = fs.readFileSync('./frontend/.cert/deliver.me.key', 'utf8');
        const certificate = fs.readFileSync('./frontend/.cert/deliver.me.crt', 'utf8');
        const credentials = {key: privateKey, cert: certificate};

        server = https.createServer(credentials, api);
        console.log("Using SSL")
    } catch (e) {
        server = http.createServer(api)
        console.log("Using plain http as no cert files were found")
    }
} else {
    server = http.createServer(api)
        console.log("Using plain http")
}


const socketIOSerer = new io.Server(server,
    {
        // TODO remove this
        cors: {
            credentials: true,
            origin: (origin, callback) => {

                // TODO remove this
                callback(null, true)

                // if (corsWhitelist.indexOf(origin) !== -1) {
                //     callback(null, true)
                // } else {
                //     callback(new Error("Not allowed by CORS"))
                // }
            },
        }
    });
const notificationService = createNotificationService(socketIOSerer)

server.listen(PORT, () => console.log(`Listening on port: ${PORT}.`));

export {notificationService}
