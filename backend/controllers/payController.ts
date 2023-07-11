import { OrderModel, OrderStatus } from '../models/order';
import { Buyer, Shopper } from "../models/customer";


const { CLIENT_ID, APP_SECRET } = process.env;
const baseURL = {
	  sandbox: "https://api-m.sandbox.paypal.com",
	  production: "https://api-m.paypal.com"
	};
export async function performCheckout(customerId: string, orderId: string) {

  try {
    const order = await OrderModel.findById(orderId);
    const buyer = await Buyer.findById(customerId);
    const shopper = await Shopper.findById(customerId);

    const accessToken = await generateAccessToken();
    
    if (!buyer || order.status !== OrderStatus.InPayment) {
      return null;
    }
    console.log(order?.totalCostOfOrder);
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
            amount: {
            value: order?.totalCostOfOrder
            },
            payment_instruction: {
                platform_fees: [
                {
                    amount: {
                    currency_code: 'EUR',
                    value: order.totalCostOfOrder
                    },
                    payee: {
                    email_address: shopper.email
                    }
                }
            ]}
        }
        ]
      })
    });
    if (response.ok) {
        const data = await response.json();
        order.status = OrderStatus.Finished;
        await order.save();
        return data;
    } else {
      console.error("Failed to perform PayPal checkout:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error performing PayPal checkout:", error);
    return null;
  }
}

// use the orders api to capture payment for an order
export async function capturePayment(orderId: string) {
  const accessToken = await generateAccessToken();
  const url = `${baseURL.sandbox}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}

// generate an access token using client id and app secret

export async function generateAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${APP_SECRET}`).toString("base64");
  const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to generate access token");
  }

  const data = await response.json();
  return data.access_token;
}

