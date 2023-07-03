import "dotenv/config";
import express, { Request, Response } from "express";
import * as paypal from "../controllers/payment/paypal";
const { PORT = 8888 } = process.env;

const route = express();

route.use(express.static("public"));

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

route.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}/`);
});
export default route;
