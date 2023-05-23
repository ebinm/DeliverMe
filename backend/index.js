const fs = require('fs');
const https = require('https');
const privateKey = fs.readFileSync('./frontend/.cert/deliver.me.key', 'utf8');
const certificate = fs.readFileSync('./frontend/.cert/deliver.me.crt', 'utf8');
const jsonwebtoken = require('jsonwebtoken')

require('dotenv').config()

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)


const express = require("express")
const {Customer} = require("./models/customer");
const bcrypt = require("bcrypt");
const app = express();

const PORT = process.env.PORT || 8443;
const credentials = {key: privateKey, cert: certificate};

app.get("/", async (req, res) => {
    return res.send("hi")
})

app.post("/personal-shopper/signup", async (req, res) => {
    // In large parts based on https://dev.to/jeffreythecoder/setup-jwt-authentication-in-mern-from-scratch-ib4
    const {firstName, lastName, email, password} = req.body;
    // TODO validate email

    const existingUser = await Customer.findOne({email})
    if (existingUser) {
        return res.status(409).send(`The email '${email}' is not available.`)
    }

    const salt = await bcrypt.genSalt(16)
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new Customer({
        email, password: passwordHash, firstName, lastName
    })

    await newUser.save()

    const jwtPayload = {
        user: {
            id: newUser.id
        }
    }

    jsonwebtoken.sign(
        jwtPayload,
        process.env.JWT_SECRET,
        {expiresIn: '30 days'},
        (err, token) => {
            if (err) {
                throw err
            }
            res.cookie(token)
        }
    )
})


app.post("/buyer/signup", async (req, res) => {
})


const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => console.log(`Listening on port: ${PORT}.`));
