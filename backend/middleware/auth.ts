import jwt from "jsonwebtoken"
import {NextFunction, Request, Response} from "express";

export function authenticated(req: Request & {userId? : number}, res: Response, next: NextFunction){
    const jwtToken = req.cookies?.["jwt"]

    if(!jwtToken){
        // TODO maybe redirect?
        return res.status(401).send("Not authenticated")
    }

    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).send("Invalid token")
        }
        req.userId = decoded.userId
        next()
    })


}