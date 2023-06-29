import express, { Application, Request, Response } from "express";
import stripe from "stripe";
import bodyParser from "body-parser";
import cors from "cors";


const router = express.Router();
const stripeInstance = new stripe(process.env.STRIPE_SECRET_TEST, {
  apiVersion: "2022-11-15", // Specify the desired API version
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(cors());

router.post("/checkout", cors(), async (req: Request, res: Response) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripeInstance.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Paying the bill",
      payment_method: id,
      confirm: true,
    });
    console.log("The bill", payment);
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

export default router;