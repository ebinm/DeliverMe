import React, { useEffect, useRef } from 'react';

export default function PayPal() {

  const paypal = useRef(); 

  useEffect(() => { 
      window.paypal
        .Buttons({
          createOrder: (data, actions, err) => {
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
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            console.log(order);
          },
          onError: (err) => {
            console.log(err);
          },
        })
        //.render(paypal.current);
      }, []);

  return (
    <div>
      <div ref={paypal}></div>
    </div>
    
  );
}
