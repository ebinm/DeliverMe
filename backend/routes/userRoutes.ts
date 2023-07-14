import express from "express";
import {authenticated, AuthenticatedRequest} from "../middleware/auth";
import {clearNotificationsForBuyerById, findBuyerById, updateBuyer} from "../controllers/buyerController";
import {clearNotificationsForShopperById, findShopperById, updateShopper} from "../controllers/shopperController";
import {findBidOrdersByShopper, findOrdersByBuyer, findOrdersByShopper} from "../controllers/orderController";

/**
 * These are the routes that shoppers and buyers have in common.
 */

const router = express.Router();

router.get("", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json(await findBuyerById(req.customerId))
        } else {
            res.json(await findShopperById(req.customerId))
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

router.get("/orders", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json(await findOrdersByBuyer(req.customerId))
        } else {
            res.json(await findOrdersByShopper(req.customerId))
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})


router.delete("/notification", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        const notificationId = req.query.notificationId
        const clearNotifications = req.customerType === "BUYER" ?
            clearNotificationsForBuyerById : clearNotificationsForShopperById
        await clearNotifications(req.customerId, notificationId === undefined ? undefined : notificationId.toString())
        res.sendStatus(200)
    } catch (e) {
        next(e)
    }
})



router.get("/bidOrders", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        if (req.customerType === "BUYER") {
            res.json({msg: "This call is only for shoppers"})
        } else {
            res.json(await findBidOrdersByShopper(req.customerId))
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})


router.patch("/", authenticated, async (req: AuthenticatedRequest, res, next) => {
    try {
        const updatedFields = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            profilePicture: req.body.profilePicture,
            paypalAccount: req.body.paypalAccount
        }

        if (req.customerType === "BUYER") {
            res.json(await updateBuyer(req.customerId, updatedFields))
        } else {
            res.json(await updateShopper(req.customerId, updatedFields))
        }
    } catch (e) {
        console.log(e)
        next(e.message)
    }
})

export default router;