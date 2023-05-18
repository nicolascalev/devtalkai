import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { UserWithNestedProperties } from "../../../types/types";
import prisma from "../../../prisma/client";

export default withApiAuthRequired(async function outputHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PATCH") {
    const session: any = await getSession(req, res);
    const user: UserWithNestedProperties = session.user;

    try {
      const output = await prisma.output.findFirst({
        where: { id: Number(req.query.outputId as string) },
      });
      if (!output) {
        return res.status(404).send("Not Found");
      }
      if (output.userId !== user.id) {
        return res.status(403).send("Forbidden");
      }
      const updated = await prisma.output.update({
        where: { id: Number(req.query.outputId as string) },
        data: { userBookmarked: !output.userBookmarked },
      });
      return res.status(200).json(updated);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  return res.status(501).send("Not implemented");
});
