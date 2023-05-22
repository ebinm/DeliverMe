
const fs = require('fs');
const https = require('https');
const privateKey  = fs.readFileSync('./frontend/.cert/deliver.me.key', 'utf8');
const certificate = fs.readFileSync('./frontend/.cert/deliver.me.crt', 'utf8');


const express = require("express")
const app = express();

const PORT = process.env.PORT || 8443;
const credentials = {key: privateKey, cert: certificate};

app.get("/", (req, res) => res.send("Hello There!"))

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => console.log(`Listening on port: ${PORT}.`));
