import React, { useState } from 'react';
import {CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { POST_FETCH_OPTIONS } from "../../util/util";

const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#AAC0AA',
      color: '#424A57',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': { color: '#AAC0AA' },
      '::placeholder': { color: '#AAC0AA' },
    },
    invalid: {
      iconColor: '#AAC0AA',
      color: '#424A57',
    },
  },
};


export default function CreditCard() {
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
   
  const handlePayment = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    }); 

    if (!error) {
      try {
        const { id } = paymentMethod;
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/checkout/stripe-payment`, 
        {
          ...POST_FETCH_OPTIONS,
          body: JSON.stringify({
            id,
            amount: 70,
          })
      });
        if (response.data.success) {
          console.log('Successful Payment');
          setSuccess(true);
        }
      } catch (error) {
        console.log('Error', error);
      }
    } else {
      console.log(error.message);
    }
  };

  return (
    <>
      {!success ? 
        <form wid="true" onSubmit={handlePayment}>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS} />
            </div>
          </fieldset>
          <button>Pay</button>
        </form>
       : 
        <div>
          <h2>Your payment was successfully sent!</h2>
        </div>
      }
    </>
  );
} 