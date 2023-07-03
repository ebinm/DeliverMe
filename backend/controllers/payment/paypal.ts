import fetch from "node-fetch";

const { CLIENT_ID, APP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

export async function createOrder() {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "70.00",
          },
          payee: {
            email_address: "personalshopper@example.com" //TODO: MONGO_DB{bind ps' email address}
          },
          payment_instruction: {
            disbursement_mode: "INSTANT",
            platform_fees: [{
              amount: {
                currency_code: "USD",
                value: "70.00" //TODO: MONGO_DB{bind ps' amount}
              }
              //Important: Capture order returns an HTTP 422 error
              // when Onboard After Payment is toggled off, and the email_address field of the payee 
              //object isn't associated with a PayPal account connected to your platform.
              // Make sure you enable the Onboard After Payment setting in your REST app settings. 
              //For more information, see HTTP status codes.
            }]
          }
        },
        
      ],
    }),
  });

  return handleResponse(response);
}

export async function capturePayment(orderId: string) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}

export async function generateAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${APP_SECRET}`).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const jsonData = await handleResponse(response);
  return jsonData.access_token;
}

async function handleResponse(response: fetch.Response) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}

