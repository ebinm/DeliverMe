import express, { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15', 
});

const app = express();

app.use(express.json());

app.post('/api/verify-card', async (req: Request, res: Response) => {
  try {
    const { cardNumber, expirationMonth, expirationYear, cvc } = req.body;

    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber,
        exp_month: expirationMonth,
        exp_year: expirationYear,
        cvc: cvc,
      },
    });

    const verificationResult = await stripe.paymentIntents.create({
        payment_method: paymentMethod.id,
        amount: 100,
        currency: 'usd',
        confirm: true,
      });

    res.json({ verified: verificationResult.status === 'succeeded' });
  } catch (error) {
    console.error('Error verifying card:', error);
    res.status(500).json({ error: 'Card verification failed' });
  }
});

// Start the server
const port = 3000; 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
