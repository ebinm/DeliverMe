import React from 'react';
import {PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js"
import { AccordionDetails } from '@mui/material';

export default function PayPal() {
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
                    value: 70.0,
                  },
                  payment_instruction: {
                    platform_fees: [{
                      amount: { 
                        currency_code: "EUR",
                        value: 70.00
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
              alert(
                "transaction went through" + AccordionDetails.payer.name.given
              )
            })
          }}
          onError = {(err) => {
            return alert ("Transaction failed");
          }
        }  
      />
    </PayPalScriptProvider>
  )
}
