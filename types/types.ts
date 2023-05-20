import { Prisma } from "@prisma/client";

export type UserWithNestedProperties = Prisma.UserGetPayload<{
  include: { stripeSub: true; adminOf: true; organization: true };
}>;

export type OutputWithProject = Prisma.OutputGetPayload<{
  include: { project: true }
}>

export type InviteWithOrganization = Prisma.InviteGetPayload<{
  include: { organization: true }
}>

export type ProjectWithOrganization = Prisma.ProjectGetPayload<{
  include: { organization: true },
}>
