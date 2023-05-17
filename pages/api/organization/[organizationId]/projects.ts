import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/client";
import { UserWithNestedProperties } from "../../../../types/types";

export default withApiAuthRequired(async function organizationProjectsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session: any = await getSession(req, res);
    const user: UserWithNestedProperties = session.user;

    // if user is not admin and it is not the same as the one in the url then fail
    if (user.organization?.id !== Number(req.query.organizationId)) {
      return res.status(403).send("Forbidden");
    }

    try {
      const result = await prisma.project.findMany({
        where: {
          organizationId: Number(req.query.organizationId),
        },
        take: 100,
      });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  return res.status(501).send("Not implemented");
});
