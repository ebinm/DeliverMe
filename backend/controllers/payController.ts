import {OrderModel, OrderStatus} from '../models/order';
import {Buyer, Shopper} from "../models/customer";
import { NotificationType } from '../models/notification';
import { notificationService } from '..';


const baseURL = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com"
};

export async function performCheckout(customerId: string, orderId: string) {
    const order = await OrderModel.findById(orderId)
        .populate("groceryBill", "-image")

    const buyer = await Buyer.findById(customerId).select("-profilePicture -notifications");

    // @ts-ignore
    const shopper = await Shopper.findById(order?.selectedBid?.createdBy).select("-profilePicture -notifications");

    if (shopper === undefined) {
        throw new Error("The order seems to have no associated shopper.")
    }


    // @ts-ignore
    if (buyer._id.toString() !== customerId || customerId !== order.createdBy._id.toString()) {
        throw new Error("You cannot pay for someone else's order")
    }

    if (!buyer) {
        throw new Error("Could not find buyer")
    }

    if (order.status !== OrderStatus.InPayment) {
        throw new Error("Order in wrong status.")
    }


    const currencyFromReceipt = order.groceryBill.costCurrency
    const currencyFromBid = order.selectedBid.moneyBidWithFee.currency

    if (currencyFromReceipt !== currencyFromBid) {
        // TODO either support mixed currencies (two transactions?) or stop people from entering two different currencies.
        throw new Error("We currently have no support for mixed currencies.")
    }


    const costReceipt = order?.groceryBill?.costAmount
    const costBid = order?.selectedBid?.moneyBidWithFee?.amount

    if (costReceipt === undefined || costBid === undefined) {
        throw new Error("Not all costs are defined")
    }

    // We are currently working with floats to represent currency. This is obviously bad and would
    // have to be fixed before we go to production.


    const accessToken = await generateAccessToken();

    try {
        const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    intent: 'CAPTURE',
                    purchase_units: [
                        {
                            reference_id: "Receipt_" + orderId,
                            description: `Payment for order with id: ${orderId}`,
                            amount: {
                                currency_code: currencyFromReceipt,
                                value: costReceipt
                            }
                        },
                        {
                            reference_id: "Deliver_Fee_" + orderId,
                            description: `Delivery fee for order with id: ${orderId}`,
                            amount: {
                                currency_code: currencyFromBid,
                                value: costBid
                            }
                        }
                    ]
                })
            }
        ).then(res => res.json());

        const transactionId = response.id
        await OrderModel.updateOne({_id: orderId}, {transactionId})

        return {
            transactionId
        }
    } catch (e) {
        throw new Error("Could not successfully send request to paypal.")
    }
}

// use the orders api to capture payment for an order
export async function capturePayment(orderId: string, customerId: string, transactionId: string) {

    const order = await OrderModel.findById(orderId)
        .populate("selectedBid.createdBy", "paypalAccount")

    // @ts-ignore
    if (order.createdBy._id.toString() !== customerId) {
        throw new Error("Order was not created by requesting customer")
    }

    if (order.transactionId === undefined || order.status !== "In Payment") {
        throw new Error("Order is not in correct status")
    }

    if (order.transactionId !== transactionId) {
        throw new Error("transactionId and transactionId from order do not match.")
    }

    const accessToken = await generateAccessToken();

    const response = await fetch(`${baseURL.sandbox}/v2/checkout/orders/${transactionId}/capture`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    })


    if (response.ok) {
        const captureParsedResult = await response.json()
        const shopperReceivedAmount = order.selectedBid.moneyBid.amount
        const shopperReceivedCurrency = order.selectedBid.moneyBid.currency
        // TODO check validity of bid amount

        // TODO actually verify that this is a paypal account
        // @ts-ignore
        const shopperPaypal = order.selectedBid.createdBy.paypalAccount

        const shopperPaymentResponse = await fetch(`${baseURL.sandbox}/v1/payments/payouts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                "sender_batch_header":
                    {
                        "sender_batch_id": `Payout_${orderId}`,
                        "email_subject": "DeliverMe Payout",
                        "email_message": "Thank you for working with DeliverMe!"
                    },
                "items": [
                    {
                        "recipient_type": "EMAIL",
                        "amount": {"value": shopperReceivedAmount, "currency": shopperReceivedCurrency},
                        "note": "Your payment for your order.",
                        "sender_item_id": orderId,
                        "receiver": shopperPaypal,
                    }
                ]
            })
        });

        if (!shopperPaymentResponse.ok) {
            console.error(await shopperPaymentResponse.json())
            // TODO better error handling
            throw new Error("Could not pay shopper")
        }

        order.status = OrderStatus.Finished
        // @ts-ignore
        notificationService.notifyShopperById(order.selectedBid.createdBy._id.toString(), {
            type: NotificationType.TransactionCompleted,
            orderId: order._id,
            date: new Date(),
            msg: "Transaction was completed"
        })
        await order.save()

        return captureParsedResult
    } else {
        throw new Error("Order not successfully captured.")
    }
}

export async function generateAccessToken() {
    const {PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET} = process.env;

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString("base64");
    const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    if (!response.ok) {
        console.error(await (response.json()))
        throw new Error("Failed to generate access token");
    }

    const data = await response.json();
    return data.access_token;
}

