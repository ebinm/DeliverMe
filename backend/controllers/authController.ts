import {Buyer, Customer, CustomerType, Shopper} from "../models/customer";
import {Request, Response} from "express";

import jsonwebtoken from 'jsonwebtoken'
import bcrypt from "bcrypt";
import {validate} from "email-validator"


/**
 * The data stored in the JWT.
 */
type JWTPayload = {
    id: string,
    type: CustomerType
}

/**
 * Signs up a new user.
 */
async function signup(req: Request, res: Response, customerType: CustomerType) {
    // In large parts based on https://dev.to/jeffreythecoder/setup-jwt-authentication-in-mern-from-scratch-ib4

    // Note: the password used here is the actual password. The password stored in the Buyer/Shopper Document
    // is obviously hashed
    const {firstName, lastName, email: emailRaw, password, profilePicture, paypalAccount}: Partial<Customer> = req.body;
    const email = emailRaw.toLowerCase()

    if(!validate(email)){
        res.status(400).json({msg: `'${email}' was not recognized as a valid email address.`})
        return
    }

    const document = customerType === "BUYER" ? Buyer : Shopper;
    let newProfilePicture;

    if (!profilePicture) {
        newProfilePicture = null;
    } else {
        newProfilePicture = profilePicture;
    }
    const existingUser = await document.findOne({email})

    if (existingUser) {
        res.status(409).json({msg: `The email '${email}' is not available.`})
        return
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new document({
        email, password: passwordHash, firstName, lastName, profilePicture: newProfilePicture, paypalAccount
    })

    await newUser.save()

    sendJWT(res, newUser.id, customerType)
}

async function login(req: Request, res: Response, customerType: CustomerType) {
    const {email: emailRaw, password}: { email: string, password: string } = req.body
    const email = emailRaw.toLowerCase()

    const document = customerType === "BUYER" ? Buyer : Shopper

    const customer = await document.findOne({email})
    if (!customer) {
        // Side channel attack point I guess. This is why you do not roll your own security...
        res.status(400).json({msg: "Email or password incorrect"})
        return
    }

    const correctPassword = await bcrypt.compare(password, customer.password)
    if (!correctPassword) {
        res.status(400).json({msg: "Email or password incorrect"})
        return
    }

    sendJWT(res, customer.id, customerType)
}

/**
 * Utility for sending the jwt token via the response.
 */
function sendJWT(res: Response, customerId: string, type: CustomerType) {
    const jwtPayload: JWTPayload = {
        id: customerId,
        type: type
    }

    jsonwebtoken.sign(
        jwtPayload,
        process.env.JWT_SECRET,
        {expiresIn: '30 days'},
        (err, token) => {
            if (err) {
                res.status(500).json({msg: "Could not create authentication"})
            }
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 30 * 60 * 60 * 24 * 1000),
                path:"/"
            }).json({msg: "Successfully authenticated"})
        }
    )
}

export {
    JWTPayload,
    login,
    signup
}