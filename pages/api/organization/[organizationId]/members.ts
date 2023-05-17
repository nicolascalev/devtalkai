import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/client";
import { UserWithNestedProperties } from "../../../../types/types";
import { inviteSchema } from "../../../../types/joiSchemas";
import paginator from "prisma-paginate";

export default withApiAuthRequired(async function organizationMembersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session: any = await getSession(req, res);
    const user: UserWithNestedProperties = session.user;

    // if user is not admin and it is not the same as the one in the url then fail
    if (user.adminOf?.id !== Number(req.query.organizationId)) {
      return res.status(403).send("Forbidden");
    }

    const paginate = paginator(prisma);
    try {
      const queryResult = await paginate.invite.paginate(
        {
          where: {
            organizationId: Number(req.query.organizationId),
            email: { contains: (req.query.email as string) || undefined },
          },
        },
        { limit: 20, page: Number(req.query.page || 1) }
      );
      return res.status(200).json(queryResult);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  if (req.method === "POST") {
    const session: any = await getSession(req, res);
    const user: UserWithNestedProperties = session.user;

    // if user is not admin and it is not the same as the one in the url then fail
    if (user.adminOf?.id !== Number(req.query.organizationId)) {
      return res.status(403).send("Forbidden");
    }

    // if the request body does not contain the required fields and format then fail
    const validated = inviteSchema.validate(req.body);
    if (validated.error) {
      return res.status(400).json(validated.error);
    }

    try {
      // check if email is already in organization list
      const foundEmail = await prisma.invite.findFirst({
        where: {
          email: req.body.email,
          organizationId: Number(req.query.organizationId),
        },
      });

      if (foundEmail) {
        return res.status(400).send("Email already in list");
      }

      // load the count of members in the organization
      const allowedEmailCount = await prisma.invite.count({
        where: {
          organizationId: Number(req.query.organizationId),
        },
      });

      // if the current plan limit is met by the current amount of members then ask to upgrade
      if (
        !user.stripeSub?.stripeSubQuantity ||
        user.stripeSub.stripeSubQuantity <= allowedEmailCount
      ) {
        return res
          .status(402)
          .send(
            "You are already at the limit of members allowed, consider upgrading"
          );
      }

      // if passed all checks then create invite
      const invite = await prisma.invite.create({
        data: {
          email: req.body.email,
          organization: { connect: { id: Number(req.query.organizationId) } },
        },
      });

      return res.status(200).json(invite);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  return res.status(501).send("Not implemented");
});
