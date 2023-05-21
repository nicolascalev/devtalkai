import useSWR from "swr";
import { basicFetcher } from "./api.client";
import { Project } from "@prisma/client";

type ProjectWithDateString = Project & {
  createdAt: string;
}

export default function useProject(projectId: number) {
  const { data, isLoading, error, mutate } = useSWR(
    "/api/project/" + projectId,
    basicFetcher
  );

  return {
    project: data as ProjectWithDateString | undefined,
    projectLoading: isLoading,
    projectLoadingError: error,
    projectRevalidate: mutate,
  };
}
