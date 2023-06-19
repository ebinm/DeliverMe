import express, { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15', // Specify the Stripe API version you want to use
});

const app = express();

app.use(express.json());

app.post('/api/verify-card', async (req: Request, res: Response) => {
  try {
    const { cardNumber, expirationMonth, expirationYear, cvc } = req.body;

    // Create a Stripe PaymentMethod with the card details
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber,
        exp_month: expirationMonth,
        exp_year: expirationYear,
        cvc: cvc,
      },
    });

    // Verify the PaymentMethod
    const verificationResult = await stripe.paymentIntents.create({
        payment_method: paymentMethod.id,
        amount: 100,
        currency: 'usd',
        confirm: true,
      });

    // Return the verification result
    res.json({ verified: verificationResult.status === 'succeeded' });
  } catch (error) {
    console.error('Error verifying card:', error);
    res.status(500).json({ error: 'Card verification failed' });
  }
});

// Start the server
const port = 3001; // Choose any port you prefer
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
