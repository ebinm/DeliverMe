import { Request, Response } from "express";
import stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_TEST;

export const checkoutController = async (req: Request, res: Response) => {
  const { amount, id } = req.body;

  try {

    const stripeInstance = new stripe(stripeSecretKey, {
      apiVersion: "2022-11-15" // Specify the desired API version
    });

    const payment = await stripeInstance.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Total amount of the bill",
      payment_method: id,
      confirm: true
    });

    console.log("Payment", payment);
    res.json({
      message: "Payment succeeded",
      success: true
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment failed",
      success: false
    });
  }
};
