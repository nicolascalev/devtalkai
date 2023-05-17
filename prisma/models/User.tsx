import prisma from "../client";
import { Prisma } from "@prisma/client";

const User = {
  async create(args: Prisma.UserCreateInput) {
    try {
      const user = await prisma.user.create({
        data: args,
      });
      return user;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async findByAuth0Sub(auth0sub: string) {
    const user = await prisma.user.findUnique({
      where: {
        auth0sub,
      },
      include: {
        stripeSub: true,
      }
    });
    return user;
  },
};

export default User;
