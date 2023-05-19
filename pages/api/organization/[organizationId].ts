import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserWithNestedProperties } from "../../../types/types";
import { organizationSchema } from "../../../types/joiSchemas";
import prisma from "../../../prisma/client";

export default withApiAuthRequired(async function organizationMembersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    const session: any = await getSession(req, res);
    const user: UserWithNestedProperties = session.user;

    // if user is not admin and it is not the same as the one in the url then fail
    if (user.adminOf?.id !== Number(req.query.organizationId)) {
      return res.status(403).send("Forbidden");
    }

    // if the request body does not contain the required fields and format then fail
    const validated = organizationSchema.validate(req.body);
    if (validated.error) {
      return res.status(400).json(validated.error);
    }

    try {
      await prisma.organization.update({
        where: { id: Number(req.query.organizationId) },
        data: req.body,
      });

      return res.status(200).send("Organization updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  return res.status(501).send("Not implemented");
});
