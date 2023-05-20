import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import paginator from "prisma-paginate";
import prisma from "../../prisma/client";
import { UserWithNestedProperties } from "../../types/types";

export default withApiAuthRequired(async function outputHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session: any = await getSession(req, res);
    const user: UserWithNestedProperties = session.user;

    const paginate = paginator(prisma);
    const page = req.query.page ? Number(req.query.page) : 1;

    try {
      const queryResult = await paginate.output.paginate(
        {
          where: {
            userId: user!.id,
            userBookmarked: req.query.bookmarked
              ? { equals: JSON.parse(req.query.bookmarked as string) }
              : undefined,
          },
          include: {
            project: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        { limit: 12, page }
      );
      return res.status(200).json(queryResult);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  res.status(501).send("Not implemented");
});
