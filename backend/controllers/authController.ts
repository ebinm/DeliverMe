import {Buyer, Customer, CustomerType, Shopper} from "../models/customer";
import {Request, Response} from "express";

import jsonwebtoken from 'jsonwebtoken'
import bcrypt from "bcrypt";
import {buyerPicture, shopperPicture} from "../datamock/defaultPictures";
import {validate} from "email-validator"


type JWTPayload = {
    id: string,
    type: CustomerType
}


async function signup(req: Request, res: Response, customerType: CustomerType) {
    // In large parts based on https://dev.to/jeffreythecoder/setup-jwt-authentication-in-mern-from-scratch-ib4

    // Note: the password used here is the actual password. The password stored in the Buyer/Shopper Document
    // is obviously hashed
    const {firstName, lastName, email: emailRaw, password}: Partial<Customer> = req.body;
    const email = emailRaw.toLowerCase()

    if(!validate(email)){
        res.status(400).json({msg: `'${email}' was not recognized as a valid email address.`})
        return
    }

    const document = customerType === "BUYER" ? Buyer : Shopper;
    let profilePicture: String;

    if (document == Buyer) {
        profilePicture = buyerPicture
    } else {
        profilePicture = shopperPicture
    }
    const existingUser = await document.findOne({email})

    if (existingUser) {
        res.status(409).json({msg: `The email '${email}' is not available.`})
        return
    }

    const salt = await bcrypt.genSalt(16)
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new document({
        email, password: passwordHash, firstName, lastName, profilePicture
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