# Devtalk AI

While developing, visit `http://127.0.0.1:3000` instead of `localhost` so that it works properly, we use the IP because that way the Stripe hooks can find it.

## Stripe webhooks

The app needs to listen to Stripe webhooks to keep subscriptions in sync. To develop locally you need:

1. A Stripe account
2. Add your `STRIPE_HOOKS` environment variable
3. Download the Stripe cli tool
4. `stripe login`
5. `stripe listen --forward-to localhost:3000/api/stripe/webhooks`
6. If you want to manually trigger a mock event `stripe trigger payment_intent.succeeded <- event name`
7. Go to your Stripe developer dashboard and add the url to your endpoint