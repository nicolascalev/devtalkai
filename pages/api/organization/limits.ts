import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { UserWithNestedProperties } from "../../../types/types";
import prisma from "../../../prisma/client";
import STRIPE_PLANS from "../../../utils/plans";

export default withApiAuthRequired(async function subscriptionQuantityHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session: any = await getSession(req, res);
    const user: UserWithNestedProperties = session.user;

    // check that user is a member of an organization
    if (!user.organizationId) {
      return res.status(400).send("User is not a member of an organization");
    }

    try {
      // get the organizations subscription status
      const organization = await prisma.organization.findUnique({
        where: { id: user.organizationId },
        include: {
          admin: {
            include: {
              stripeSub: true,
            },
          },
        },
      });

      if (!organization) {
        return res.status(404).send("Organization not found");
      }

      // find the plan to see the limits
      const plan = STRIPE_PLANS.find((plan) =>
        organization.admin.stripeSub!.stripeSubProductName.includes(
          plan.matcher
        )
      );

      const data = {
        subscriptionStatus:
          organization.admin.stripeSub?.stripeSubStatus || "not subscribed",
        memberLimit: plan!.memberLimit,
        projectLimit: plan!.projectLimit,
      };

      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  return res.status(501).send("Not implemented");
});
