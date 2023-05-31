import React, { useState, useEffect, useRef } from 'react';

export default function CreditCard() {
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState(null);
  const paypalRef = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Your description",
                amount: {
                  currency_code: "INR",
                  value: '500.0',
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          setPaid(true);
          console.log(order);
        },
        onError: (err) => {
          //   setError(err),
          console.error(err);
        },
      })
      .render(paypalRef.current);

  }, []);

  if (paid) {
    return <div>Payment successful.!</div>;
  }

  if (error) {
    return <div>Error Occurred in processing payment.! Please try again.</div>;
  }

  return (
    <div>
      {paid ? (
        <div>Payment successful!</div>
      ) : error ? (
        <div>Error occurred while processing payment. Please try again.</div>
      ) : (
        <div ref={paypalRef}></div>
      )}
    </div>
  );
}
