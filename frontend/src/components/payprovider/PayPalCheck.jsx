import React, {useRef, useEffect} from 'react';

export default function PayPalCheck(){

    const paypal = useRef();

    useEffect(()=> {
        window.paypal.Buttons({
            createOrder: (data, actions, err)=> {
                return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            description: "Total Bill being paid",
                            amount: {
                                currency_code: "USD",
                                value: 70.00
                            }
                        }
                    ]
                })
            },
            onApprove: async (data, actions) => {
                const order = await actions.order.capture();
                console.log("Successful order:" + order);
            },
            onError: (err) => {
                console.log(err);
            }
        }).render(paypal.current)
    }, [])

    return (
        <div>
            <div ref={paypal.current}></div>
        </div>
    )
}