
const fs = require('fs');
const https = require('https');
const privateKey  = fs.readFileSync('./frontend/.cert/deliver.me.key', 'utf8');
const certificate = fs.readFileSync('./frontend/.cert/deliver.me.crt', 'utf8');

require('dotenv').config()

const mongoose= require('mongoose');
mongoose.connect(process.env.MONGO_URL)


const express = require("express")
const app = express();

const PORT = process.env.PORT || 8443;
const credentials = {key: privateKey, cert: certificate};

app.get("/", async (req, res) => {
    return res.send("hi")
})


const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => console.log(`Listening on port: ${PORT}.`));
