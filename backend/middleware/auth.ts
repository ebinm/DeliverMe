import jwt from "jsonwebtoken"
import {NextFunction, Request, Response} from "express";
import {JWTPayload} from "../controllers/authController";
import {CustomerType} from "../models/customer";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import io from "socket.io";
import {ExtendedError} from "socket.io/dist/namespace";
import cookie from "cookie"


/**
 * Use this type for the request if the authentication middleware was used.
 * It provides the verified customerId and type from the JWT
 */
type AuthenticatedRequest = Request & {
    customerId: string,
    customerType: CustomerType
}

/**
 * Middleware to read, decode and verify the jwt token from the handshake of a socket.io connection.
 */
function authenticatedSocket(socket: io.Socket<DefaultEventsMap, DefaultEventsMap>, next: (err?: ExtendedError) => void) {
    const c = socket.handshake.headers.cookie
    const jwtToken = c && cookie.parse(c)?.["jwt"]

    if (!jwtToken) {
        socket.disconnect()
        next(new Error("Not authenticated"))
        return
    }

    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded: JWTPayload) => {
        if (err) {
            next(new Error("Invalid token"))
            return
        }

        socket.handshake.auth = {
            customerId: decoded.id,
            customerType: decoded.type
        }
        next()
    })
}

/**
 *
 * Middleware for using cookie-based jwt and writing the data (customerId and type) to the request object.
 */
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
    authenticated,
    authenticatedSocket
}