import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { UserWithNestedProperties } from "../../types/types";
import STRIPE_PLANS from "../../utils/plans";
import prisma from "../../prisma/client";
import { projectSchema } from "../../types/joiSchemas";
import { Prisma } from "@prisma/client";

export default withApiAuthRequired(async function subscriptionQuantityHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
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

      // make sure the organization has an active subscription
      if (organization.admin?.stripeSub?.stripeSubStatus !== "active") {
        return res
          .status(400)
          .send("The organization does not have an active subscription");
      }

      // count the current amount of projects
      const organizationProjectCount = await prisma.project.count({
        where: {
          organizationId: organization.id,
        },
      });

      // find the plan to see the limits
      const plan = STRIPE_PLANS.find((plan) =>
        organization.admin.stripeSub!.stripeSubProductName.includes(
          plan.matcher
        )
      );

      // check that the current project count is less than the project limit
      if (organizationProjectCount >= plan!.projectLimit) {
        return res
          .status(400)
          .send(
            "The amount of projects for your plan has been met, please consider upgrading"
          );
      }

      // validate the request body
      const validated = projectSchema.validate(req.body);
      if (validated.error) {
        return res.status(400).send(validated.error.message);
      }

      const data: Prisma.ProjectCreateInput = req.body;
      data.organization = {
        connect: {
          id: organization.id,
        },
      };

      // finally create project
      const project = await prisma.project.create({
        data,
      });

      return res.status(200).json(project);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  return res.status(501).send("Not implemented");
});
