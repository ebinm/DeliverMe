import {Response} from "express";
import {Customer, CustomerType} from "../models/customer";


export function returnImage(res: Response, base64Image: string | undefined){
    if(!base64Image){
        res.status(404).send()
        return
    }

    const delimiter = base64Image.indexOf(",")
    const mimeType = base64Image.slice("data:".length, delimiter)
    const base64Data = base64Image.slice(delimiter)

    res.status(200).contentType(mimeType).send(Buffer.from(base64Data, "base64"))
}


export function populateProfilePicture(type: CustomerType, customer: Customer){
    customer.profilePicture = `${process.env.HOST}/api/${type.toLowerCase()}/${customer._id}/profilePicture`
}