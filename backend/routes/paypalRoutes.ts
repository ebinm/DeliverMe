import express, { Request, Response } from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// POST /api/capture-paypal-order
router.post('/capture-paypal-order', async (req: Request, res: Response) => {
  try {
    const { orderId, paymentDetails } = req.body;


    const accessToken = await generateAccessToken();
    const captureUrl = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(captureUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paymentDetails),
    });

    const orderData = await response.json();
    res.json(orderData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to capture PayPal order' });
  }
});

async function generateAccessToken() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const jsonData = await handleResponse(response);
  return jsonData.access_token;
}

async function handleResponse(response: fetch.Response) {
  if (response.ok) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}

export default router;
