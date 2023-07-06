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
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            console.log('Payment completed successfully:', order);
           
          },
          onError: (err) => {
            console.log(err);
          },
        })
        .render(paypal.current);
      }, []);

  return (
    <div>
      <div ref={paypal}></div>
    </div>
    
  );
}
