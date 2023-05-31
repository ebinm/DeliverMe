# DeliverMe

## Development Setup

jwt: 9cf49be9c2b84412a99afec0b01f9ccd

### Scripts

The backend `package.json` contains two ways of running a dev build.
Either run `start` which will trigger the TS compiler in `prestart` or
use the file watchers `watchCompileTS` for continuous TS compilation and `watchRunNode`
for automatic restarts.

The frontend can simply be run using the `start` script.

### Environment Variables

We use dotenv. Create the files `./frontend/.env` and  `./.env` and set the following values:

#### Frontend

| Name              | Description                                                                                                                     |
|-------------------|---------------------------------------------------------------------------------------------------------------------------------|
| HTTPS             | `true` or `false` depending on if SSL is wanted                                                                                 |
| SSL_CRT_FILE      | `./.cert/deliver.me.crt` or the desired location of the SSL certificate. (Other values require the backend to be reconfigured.) |
| SSL_KEY_FILE      | `./.cert/deliver.me.key` or the desired location of the SSL key.                                                                |
| REACT_APP_BACKEND | The url of the backend. For example: `https://localhost:8443 `                                                                  |

#### Backend

| Name       | Description                            |
|------------|----------------------------------------|
| MONGO_URL  | The url to connect to MongoDB          |
| JWT_SECRET | The secret used for signing JWT tokens |


HTTPS=true
SSL_CRT_FILE=./.cert/deliver.me.crt
SSL_KEY_FILE=./.cert/deliver.me.key

REACT_APP_BACKEND=https://localhost:8443

### SSL

Both frontend and backend support both SSL and plain http.
If SSL is wanted, place the key and certificate files in `./frontend/.cert` naming them
`deliver.me.crt` and `deliver.me.key` respectively. 
