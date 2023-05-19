import useSWR from "swr";
import { basicFetcher } from "./api.client";
import { Project } from "@prisma/client";

export default function useOrganizationProjects(organizationId?: number) {
  const { data, isLoading, error, mutate } = useSWR(
    organizationId ? `/api/organization/${organizationId}/projects` : null,
    basicFetcher
  );

  return {
    projects: data as Project[],
    projectsLoading: isLoading,
    projectsError: error,
    projectsRevalidate: mutate,
  };
}
