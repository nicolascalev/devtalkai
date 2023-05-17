import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/client";
import { UserWithNestedProperties } from "../../../../types/types";
import paginator from "prisma-paginate";

export default withApiAuthRequired(async function organizationInvitesHandler(
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

  return res.status(501).send("Not implemented");
});
