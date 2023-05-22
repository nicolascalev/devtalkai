import {
  getSession,
  handleAuth,
  handleCallback,
  handleProfile,
  Session,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import User from "../../../prisma/models/User";
import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/client";

const afterCallback = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  const auth0User: any = session.user;
  try {
    // try to find user by email
    let user: any = await prisma.user.findUnique({
      where: { email: auth0User.email },
      include: {
        stripeSub: true,
        organization: true,
        adminOf: true,
      },
    });
    // if not found create it
    if (!user) {
      const newUser: Prisma.UserCreateInput = {
        fullName: auth0User.name,
        auth0sub: auth0User.sub,
        email: auth0User.email,
      };
      user = await User.create(newUser);
    } else {
      //  if found, make sure the auht0 sub is up to date
      user = await prisma.user.update({
        where: { email: user.email },
        data: { auth0sub: auth0User.sub },
        include: {
          stripeSub: true,
          organization: true,
          adminOf: true,
        },
      });
    }
    session.user = user;
    return session;
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
};

const afterRefetch = (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) => {
  const newSession = getSession(req, res);
  if (newSession) {
    return newSession as Promise<Session>;
  }
  return session;
};

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error) {
      res.status((error as any).status || 500).end();
    }
  },
  async profile(req, res) {
    try {
      await handleProfile(req, res, {
        refetch: true,
        afterRefetch, // added afterRefetch Function
      });
    } catch (error: any) {
      res.status(error.status || 500).end(error.message);
    }
  },
});
