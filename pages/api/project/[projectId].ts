// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";
import { UserWithNestedProperties } from "../../../types/types";
import { projectSchema } from "../../../types/joiSchemas";

export default withApiAuthRequired(async function singleProjectHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const session: any = await getSession(req, res);
      const user: UserWithNestedProperties = session.user;

      const projectId = Number(req.query.projectId as string);

      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        return res.status(404).send("Project not found");
      }

      if (user.organizationId !== project.organizationId) {
        return res.status(403).send("Forbidden");
      }

      return res.status(200).json(project);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  if (req.method === "PATCH") {
    try {
      const session: any = await getSession(req, res);
      const user: UserWithNestedProperties = session.user;

      const projectId = Number(req.query.projectId as string);

      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        return res.status(404).send("Project not found");
      }

      if (user.organizationId !== project.organizationId) {
        return res.status(403).send("Forbidden");
      }

      const validated = projectSchema.validate(req.body);
      if (validated.error) {
        return res.status(400).send(validated.error.message);
      }

      const updatedProject = await prisma.project.update({
        where: { id: Number(req.query.projectId) },
        data: req.body,
      });

      return res.status(200).json(updatedProject);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  return res.status(501).send("Not implemented");
});
