// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";
import { UserWithNestedProperties } from "../../../types/types";

export default withApiAuthRequired(async function userInvitesHanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const session: any = await getSession(req, res);
      const user: UserWithNestedProperties = session.user;

      const invites = await prisma.invite.findMany({
        where: {
          email: user.email,
        },
        include: {
          organization: true,
        }
      });
      return res.status(200).json(invites);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  return res.status(501).send("Not implemented");
});
