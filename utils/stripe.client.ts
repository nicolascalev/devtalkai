import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET) throw new Error("Missing STRIPE_SECRET in env variables");
const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2022-11-15',
});

export default stripe;