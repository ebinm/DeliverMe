import express, { Request, Response } from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import bodyParser from "body-parser";
import cors from "cors";
import * as paypal from "../controllers/payment/paypal";


dotenv.config();
const route = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST!, {
  apiVersion: "2022-11-15",
});

route.use(bodyParser.urlencoded({ extended: true }));
route.use(bodyParser.json());
route.use(cors());
// parse post params sent in body in json format
route.use(express.json());

route.post("/create-paypal-order", async (req: Request, res: Response) => {
  try {
    const order = await paypal.createOrder();
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

route.post("/capture-paypal-order", async (req: Request, res: Response) => {
  const { orderID } = req.body;
  try {
    const captureData = await paypal.capturePayment(orderID);
    res.json(captureData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//stripe
route.post("/checkout", cors(), async (req: Request, res: Response) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "EUR",
      payment_method: id,
      confirm: true,
    });
    console.log("Payment", payment);
    res.json({
      message: "Payment successful",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment failed",
      success: false,
    });
  }
});