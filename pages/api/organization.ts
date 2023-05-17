import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { UserWithNestedProperties } from "../../types/types";
import { organizationSchema } from "../../types/joiSchemas";
import prisma from "../../prisma/client";
import { Prisma } from "@prisma/client";

export default withApiAuthRequired(async function organizationHanlder(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session: any = await getSession(req, res);
    const user: UserWithNestedProperties = session.user;

    if (user.adminOf) {
      return res
        .status(400)
        .json({ error: "User is the admin of an organization already " });
    }

    const validated = organizationSchema.validate(req.body);
    if (validated.error) {
      return res.status(400).json(validated.error);
    }

    const data: Prisma.OrganizationCreateInput = req.body;
    data.roles = JSON.stringify(req.body.roles || []);
    data.admin = {
      connect: { id: user.id },
    };
    data.members = {
      connect: { id: user.id },
    };
    data.invites ={
      create: {
        email: user.email,
      }
    }

    try {
      await prisma.organization.create({
        data,
      });
      return res.status(201).send("Organization created");
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  return res.status(501).send("Not implemented");
});
