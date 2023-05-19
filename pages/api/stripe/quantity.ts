import type { NextApiRequest, NextApiResponse } from "next";
import stripe from "../../../utils/stripe.client";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { UserWithNestedProperties } from "../../../types/types";
import STRIPE_PLANS from "../../../utils/plans";

export default withApiAuthRequired(async function subscriptionQuantityHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session: any = await getSession(req, res);
    const user: UserWithNestedProperties = session.user;

    if (!user.stripeSub) {
      return res
        .status(400)
        .json({ error: "User does not have a subscription yet" });
    }

    if (!req.body.quantity) {
      return res.status(400).json({ error: "parameter 'quantity' is missing" });
    }

    const plan = STRIPE_PLANS.find((plan) =>
      user.stripeSub!.stripeSubProductName.includes(plan.matcher)
    );
    if (req.body.quantity > plan!.memberLimit) {
      return res.status(400).json({
        error: `The limit for your plan ${
          user.stripeSub!.stripeSubProductName
        } is ${
          plan!.memberLimit
        }, consider upgrading and then you can increse the member limit`,
      });
    }

    const fullSubscription = await stripe.subscriptions.retrieve(
      user.stripeSub.stripeSubId,
      { expand: ["items.data.price.product"] }
    );

    const itemId = fullSubscription.items.data[0].id;

    try {
      await stripe.subscriptionItems.update(itemId, {
        quantity: req.body.quantity,
      });

      return res.status(200).send("Updated");
    } catch (err) {
      console.error(
        "[STRIPE ERROR] Could not update subscription member limit",
        err
      );
      return res.status(500).json(err);
    }
  }

  return res.status(501).send("Not implemented");
});
