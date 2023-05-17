import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { UserWithNestedProperties } from "../../types/types";
import prisma from "../../prisma/client";
import { Prisma } from "@prisma/client";
import { profileSchema } from "../../types/joiSchemas";

export default withApiAuthRequired(async function profileHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    const session: any = await getSession(req, res);
    const user: UserWithNestedProperties = session.user;

    const validated = profileSchema.validate(req.body);
    if (validated.error) {
      return res.status(400).json(validated.error);
    }

    try {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ...req.body,
        },
      });
      return res.status(200).send("Profile updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  return res.status(501).send("Not implemented");
});
