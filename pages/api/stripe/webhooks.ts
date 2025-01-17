import type { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import prisma from "../../../prisma/client";
import stripe from "../../../utils/stripe.client";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function stripeWebhookHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let event = req.body;
  const rawBody = await getRawBody(req);
  const endpointSecret = process.env.STRIPE_HOOKS;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature as string | string[],
        endpointSecret
      );
    } catch (err) {
      console.error(
        `[STRIPE] Webhook signature verification failed.`,
        (err as any).message
      );
      return res.status(400).end();
    }
  }
  let subscription;

  switch (event.type) {
    case "checkout.session.completed":
      subscription = event.data.object;

      const costumerEmail = subscription.customer_details.email;

      let userId: number | null = null;
      // if the subscription was created and no id was provided that means it was a guest
      if (!subscription.client_reference_id) {
        // first try to use a user if the email is taken
        const foundUser = await prisma.user.findUnique({
          where: { email: costumerEmail },
        });
        if (foundUser) {
          userId = foundUser!.id;
        } else {
          // if the email is not taken we need to onboard the admin
          // first we create an organization wtih an invite and an admin
          const createdOrganization =
            await prisma.organization.create<Prisma.OrganizationCreateArgs>({
              data: {
                name: costumerEmail + " organization",
                about: "TBD",
                domainIndustry: "TBD",
                domainLiteracy: "TBD",
                admin: {
                  create: {
                    email: costumerEmail,
                    auth0sub: "pending_signup_" + Date.now().toString(),
                    fullName: costumerEmail,
                  },
                },
                invites: {
                  create: {
                    email: costumerEmail,
                  },
                },
              },
              include: {
                admin: true,
              },
            });

          // once the admin is created we need to add it as a member to the organization
          await prisma.organization.update({
            where: { id: createdOrganization.id },
            data: {
              members: {
                connect: { id: createdOrganization.adminId },
              },
            },
          });
          userId = createdOrganization.adminId;
        }
      } else {
        userId = Number(subscription.client_reference_id);
      }

      const user = await prisma.user.update({
        where: { id: userId as number },
        data: { stripeCustomerId: subscription.customer },
      });
      const fullSubscription = await stripe.subscriptions.retrieve(
        subscription.subscription,
        { expand: ["items.data.price.product"] }
      );
      await prisma.subscription.create({
        data: {
          customer: {
            connect: { id: user.id },
          },
          stripeSubId: fullSubscription.id,
          stripeSubPriceId: fullSubscription.items.data[0].price.id,
          stripeSubProductName: (
            fullSubscription.items.data[0].price.product as Stripe.Product
          ).name,
          stripeSubStatus: fullSubscription.status,
          stripeSubQuantity: fullSubscription.items.data[0].quantity as number,
        },
      });
      break;

    case "customer.subscription.updated":
      console.log("Triggered customer.subscription.updated");
      subscription = event.data.object;
      const fullSubscriptionUpdate = await stripe.subscriptions.retrieve(
        subscription.id,
        { expand: ["items.data.price.product"] }
      );
      await prisma.subscription.updateMany({
        where: { stripeSubId: subscription.id },
        data: {
          stripeSubPriceId: fullSubscriptionUpdate.items.data[0].price.id,
          stripeSubProductName: (
            fullSubscriptionUpdate.items.data[0].price.product as Stripe.Product
          ).name,
          stripeSubStatus: fullSubscriptionUpdate.status,
          stripeSubQuantity: fullSubscriptionUpdate.items.data[0]
            .quantity as number,
        },
      });
      break;

    case "customer.subscription.deleted":
      subscription = event.data.object;
      await prisma.subscription.updateMany({
        where: { stripeSubId: subscription.id },
        data: { stripeSubStatus: subscription.status },
      });
      break;

    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
  // Return a 200 response to acknowledge receipt of the event
  res.status(200).end();
}
