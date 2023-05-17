// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSession, updateSession } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import { UserWithNestedProperties } from "../../../types/types";
import prisma from "../../../prisma/client";

export default async function profileHandler(
  req: NextApiRequest,
  res: NextApiResponse<UserWithNestedProperties | null>
) {
  const session: any = await getSession(req, res);
  if (!session && !session?.user) {
    return res.status(200).json(null);
  }
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    include: {
      stripeSub: true,
      organization: true,
      adminOf: true,
    },
  });
  await updateSession(req, res, { ...session, user });
  return res.status(200).json(user);
}
