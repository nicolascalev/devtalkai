import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import openai from "../../utils/openai.client";
import { ChatCompletionRequestMessage } from "openai/dist/api";
import prisma from "../../prisma/client";
import { UserWithNestedProperties } from "../../types/types";
import { getPrompt, getPromptContext } from "../../utils/getPrompt";
import { AxiosError } from "axios";

type PromptBody = {
  history: ChatCompletionRequestMessage[];
  projectId: number;
  voice: string;
  mark: string;
};

export default withApiAuthRequired(async function promptHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session: any = await getSession(req, res);
    const user: UserWithNestedProperties = session.user;

    if (!req.body.projectId) {
      return res.status(400).send("projectId is required in the request body");
    }

    if (!user.organizationId) {
      return res.status(400).send("User is not a member in an organization");
    }

    const body: PromptBody = req.body;

    try {
      // think about how to optimize this so we don't hve to populate org > admin > sub
      // because if we do that in every message it may take too long
      const project = await prisma.project.findUnique({
        where: { id: Number(body.projectId) },
        include: {
          organization: {
            include: {
              admin: {
                include: { stripeSub: true },
              },
            },
          },
        },
      });

      if (!project) {
        return res.status(404).send("Project not found");
      }

      if (project!.organizationId !== user.organizationId) {
        return res
          .status(401)
          .send(
            "The project selected does not belong to the user's organization"
          );
      }

      if (project.organization.admin.stripeSub?.stripeSubStatus !== "active") {
        return res
          .status(402)
          .send("The organization does not have an active subscription");
      }

      const result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: body.history.map((item) => ({
          role: item.role,
          content: item.content,
        })),
      });

      const output = await prisma.output.create({
        data: {
          user: { connect: { id: user.id } },
          project: { connect: { id: project!.id } },
          body: result.data.choices[0].message!.content as string,
          organization: { connect: { id: user.organizationId } },
          markedAs: body.mark,
          voice: body.voice,
        },
      });

      return res
        .status(200)
        .json({ output, tokens: result.data.usage?.total_tokens });
    } catch (err) {
      console.log(err);
      const error: AxiosError = err as any;
      if (error.response?.data) {
        return res.status(500).json(error.response.data);
      }

      console.log(error.response?.data);
      return res.status(500).json(err);
    }
  }
  return res.status(501).send("Method not implemented");
});
