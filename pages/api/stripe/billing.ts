import type { NextApiRequest, NextApiResponse } from "next";
import stripe from "../../../utils/stripe.client";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { UserWithNestedProperties } from "../../../types/types";

export default withApiAuthRequired(async function billingHanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: any = await getSession(req, res);
  const user: UserWithNestedProperties = session.user;

  const freshUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!freshUser || !freshUser.stripeCustomerId) {
    return res.status(400).send("User does not have a stripe customer id");
  }

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: freshUser!.stripeCustomerId as string,
      return_url: process.env.NEXT_PUBLIC_BASE_URL + "/",
    });
    return res.redirect(portal.url);
  } catch (err) {
    return res.status(500).json(err);
  }
});
