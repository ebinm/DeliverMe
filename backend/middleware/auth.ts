import jwt from "jsonwebtoken"
import {NextFunction, Request, Response} from "express";
import {JWTPayload} from "../services/authService";
import {CustomerType} from "../models/customer";

type AuthenticatedRequest = Request & {
    customerId: number,
    customerType: CustomerType
}

function authenticated(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const jwtToken = req.cookies?.["jwt"]

    if (!jwtToken) {
        return res.status(401).json({msg: "Not authenticated"})
    }

    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded: JWTPayload) => {
        if (err) {
            return res.status(401).json({msg: "Invalid token"})
        }
        req.customerId = decoded.id
        req.customerType = decoded.type
        next()
    })
}

export {
    AuthenticatedRequest,
    authenticated
}