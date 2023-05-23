import {CustomerType} from "../models/customerType";
import {Request, Response} from "express";
import {Model} from "mongoose";

import jsonwebtoken from 'jsonwebtoken'
import bcrypt from "bcrypt";

export async function signup(req: Request, res: Response, document: Model<CustomerType>) {
    // In large parts based on https://dev.to/jeffreythecoder/setup-jwt-authentication-in-mern-from-scratch-ib4

    // Note: the password used here is the actual password. The password stored in the Buyer/Shopper Document
    // is obviously hashed
    const {firstName, lastName, email, password}: Partial<CustomerType> = req.body;
    // TODO validate email

    const existingUser = await document.findOne({email})

    if (existingUser) {
        return res.status(409).send(`The email '${email}' is not available.`)
    }

    const salt = await bcrypt.genSalt(16)
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new document({
        email, password: passwordHash, firstName, lastName
    })

    await newUser.save()


    sendJWT(res, newUser.id)
}

export async function login(req: Request, res: Response, document: Model<CustomerType>) {
    const {email, password}: {email: string, password: string} = req.body

    const customer = await document.findOne({email})
    if (!customer) {
        return res.status(400).send("Email or password incorrect")
    }

    const correctPassword = await bcrypt.compare(password, customer.password)
    if (!correctPassword) {
        return res.status(400).send("Email or password incorrect")
    }

    sendJWT(res, customer.id)
}

function sendJWT(res: Response, customerId: number) {
    const jwtPayload = {
        customerId: customerId
    }

    jsonwebtoken.sign(
        jwtPayload,
        process.env.JWT_SECRET,
        {expiresIn: '30 days'},
        (err, token) => {
            if (err) {
                res.status(500).send("Could not create authentication")
            }
            res.cookie("jwt", token).send("Successfully authenticated")
        }
    )
}