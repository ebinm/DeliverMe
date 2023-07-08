import React from 'react';
import {PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js"
import { AccordionDetails } from '@mui/material';
import {useSnackbar} from "notistack";

export default function PayPal() {
  const {enqueueSnackbar} = useSnackbar();
  return(
    <PayPalScriptProvider options={{
      "client-id": process.env.CLIENT_ID
      }}>
      <PayPalButtons 
        createOrder={(data, actions, err)  => {
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  amount: {
                    value: 10.0,
                  },
                  payment_instruction: {
                    platform_fees: [{
                      amount: { 
                        currency_code: "EUR",
                        value: 10.00
                      },
                      payee: {
                        email_address: 'anxhela.maloku@tum.de',
                      }
                    }]
                  },
              }
              ],
            
            });
          }}
          onApprove={ (data, actions) => {
            return actions.order.capture().then(function(datails){
              return enqueueSnackbar("Transaction went through.", {variant: "success"})
          })
          }}
          onError = {(err) => {
            return enqueueSnackbar("Transaction failed.", {variant: "error"})
          }
        }  
      />
    </PayPalScriptProvider>
  )
}
