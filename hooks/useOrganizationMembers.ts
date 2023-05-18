import useSWR from "swr";
import { basicFetcher } from "./api.client";
import { PaginationResult } from "prisma-paginate";
import { User } from "@prisma/client";

export default function useOrganizationMembers(organizationId?: number) {
  const { data, isLoading, error } = useSWR(
    organizationId ? `/api/organization/${organizationId}/members` : null,
    basicFetcher
  );

  const response: PaginationResult<User> = data;

  return {
    membersResponse: response,
    membersLoading: isLoading,
    membersLoadingError: error,
  };
}
