import { Output, Prisma } from "@prisma/client";
import { ChatCompletionRequestMessage } from "openai/dist/api";

export type UserWithNestedProperties = Prisma.UserGetPayload<{
  include: { stripeSub: true; adminOf: true; organization: true };
}>;

export type OutputWithProject = Prisma.OutputGetPayload<{
  include: { project: true };
}>;

export type InviteWithOrganization = Prisma.InviteGetPayload<{
  include: { organization: true };
}>;

export type ProjectWithOrganization = Prisma.ProjectGetPayload<{
  include: { organization: true };
}>;

export type OutputListItemType = ChatCompletionRequestMessage & {
  output?: Output;
};
