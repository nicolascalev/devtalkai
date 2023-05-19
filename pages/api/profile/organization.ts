import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";
import { UserWithNestedProperties } from "../../../types/types";

export default withApiAuthRequired(async function joinOrganizationHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const session: any = await getSession(req, res);
      const user: UserWithNestedProperties = session.user;

      // check the request body has all body params
      if (!req.body.inviteId) {
        return res.status(400).send("Missing 'inviteId' in request body");
      }

      // check if that invite still exists
      const existingInvite = await prisma.invite.findUnique({
        where: { id: req.body.inviteId },
      });
      if (!existingInvite) {
        return res
          .status(404)
          .send("That invite no longer exists or has been deleted");
      }

      // if the invite is for another user then fail
      if (existingInvite.email !== user.email) {
        return res
          .status(401)
          .send("That invite does not belong to the logged in user");
      }

      // all checks passed so update the user
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          organization: {
            connect: { id: existingInvite.organizationId },
          },
        },
      });

      if (updatedUser) {
        return res.status(200).send("User joined organization");
      } else {
        return res.status(400).send("User's organization was not updated");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  if (req.method === "DELETE") {
    try {
      const session: any = await getSession(req, res);
      const user: UserWithNestedProperties = session.user;

      if (!user.organization) {
        return res.status(400).send("User is not a member in an organization");
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          organization: {
            disconnect: true,
          },
        },
      });

      return res.status(200).send("User left the organization");
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  return res.status(501).send("Not implemented");
});
