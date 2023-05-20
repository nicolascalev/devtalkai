import { User } from "@prisma/client";
import { ProjectWithOrganization } from "../types/types";

export type GetPromptContextArgs = {
  project: ProjectWithOrganization;
  user: User;
};

export function getPromptContext(args: GetPromptContextArgs): string {
  const project = args.project;
  const organization = args.project.organization;
  const user = args.user;

  const prompt = `
  You help to explain things to people with different backgrounds, in the same organization.
  The domain of the organization, or the project both matter because it gives more context.
  So the language you use is easy to understand for the members of the organization depending on teir role.
  The organization's name is "${organization.name}". ${
    organization.about
  }. We are in the ${organization.domainIndustry} industry.
  The organization has technical and non-technical people.
  I am a ${user.role || "employee"}. The project is "${
    project.label
  }", project description: ${project.description}.
`;
  return prompt.trim();
}

export type GetPromptArgs = {
  prompt: string;
  voice: string;
};

export function getPrompt(args: GetPromptArgs): string {
  const prompt = `
  ${args.prompt}.
  Examplain it to a ${args.voice}
`;

  return prompt.trim();
}
