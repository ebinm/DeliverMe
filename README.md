# DeliverMe

## Development Setup

TLDR: `npm run tldr `

### Things to do

Make sure your ip is whitelisted on AtlasDB. Else the backend can not connect with the instance.

Whenever pulling a branch, just assume the dependencies have changed and run `npm i` (twice: one in `./.` and
once in `./frontend`).

### Scripts

The backend `package.json` contains two ways of running a dev build.
Either run `start` which will trigger the TS compiler in `prestart` or
use the file watchers `watchCompileTS` for continuous TS compilation and `watchRunNode`
for automatic restarts.

The frontend can simply be run using the `start` script.

### Environment Variables

Note: For ease of use we have provided `.env` files in the repository. This does not reflect
best practice. We have decided for it makes setup easier and all secrets used here are of minor value.

We use dotenv. Create the files `./frontend/.env` and  `./.env` and set the following values:

#### Frontend

| Name                | Description                                                                                                                     |
|---------------------|---------------------------------------------------------------------------------------------------------------------------------|
| HTTPS               | `true` or `false` depending on if SSL is wanted                                                                                 |
| SSL_CRT_FILE        | `./.cert/deliver.me.crt` or the desired location of the SSL certificate. (Other values require the backend to be reconfigured.) |
| SSL_KEY_FILE        | `./.cert/deliver.me.key` or the desired location of the SSL key.                                                                |
| REACT_APP_BACKEND   | The url of the backend. For example:`https://localhost:8443` or `http://localhost:8443` depending on if SSL is used or not      |
| REACT_APP_WEBSOCKET | The url of the socket. For example:`wss://localhost:8443` or `ws://localhost:8443` depending on if SSL is used or not           |

#### Backend

| Name              | Description                                                                                                                 |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------|
| MONGO_URL         | The url to connect to MongoDB . For example: `mongodb+srv://deliver-me:VQrcNNkTuK0Kv9Mg@delivermeprod.di6io6m.mongodb.net/` |
| JWT_SECRET        | The secret used for signing JWT tokens. For example: `9cf49be9c2b84412a99afec0b01f9ccd`                                     |
| https             | Optional: `true` if you want https                                                                                          |
| SSL_CRT_FILE      | Optional: The location of the SSL certificate, e.g., `./.cert/deliver.me.crt`                                               |
| SSL_KEY_FILE      | Optional: The location of the SSL key, e.g., `./.cert/deliver.me.key`                                                       |
| PAYPAL_CLIENT_ID  | The PayPal client id, e.g., `AU6poA6j7PdcDNvcIDx3fX9gWAe_bFuYotS28JWcD1Y0yCm-rEvgU8t6RtUmwTRI5_oJdZVFrmOT2s6Q`              |
| PAYPAL_APP_SECRET | The PayPal app secret, e.g., `EN3Mw5S60DVdZ9BiFD-Jti2XSIAZmQIMFYkrstnUGVO6kpXAciqJxT2Ki4DyISOUQOWvHYE3ZnUQqxZg`             |

### SSL

Both frontend and backend support both SSL and plain http.
If SSL is wanted, place the key and certificate files in `./frontend/.cert` naming them
`deliver.me.crt` and `deliver.me.key` respectively.

If you want to create a locally trusted script for development the following link might prove useful:
https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/

If you message Lukas Rossi he can also send you a root certificate and signed certificates for localhost which you can
then install/ add to trust store.
I would not recommend this option though as it in theory poses a security risk.

## Simons

Backend: npm run watchCompileTS & npm run watchRunNode

Install: npm i --force

Frontend: npm start

Mongo: https://cloud.mongodb.com/v2/646b6578d7b432020c271dab#/clusters

- Name: l.rossi@tum.de
- pw: Ne5?eyDKcPReet*
