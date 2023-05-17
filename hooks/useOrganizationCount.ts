import useSWR from "swr";
import { basicFetcher } from "./api.client";

export default function useOrganizationCount(
  organizationId: number | undefined
) {
  const { data, error, isLoading, mutate } = useSWR(
    organizationId ? `/api/organization/${organizationId}/count` : null,
    basicFetcher
  );

  return {
    count: data as
      | { inviteCount: number; memberCount: number }
      | null
      | undefined,
    countError: error,
    countLoading: isLoading,
    countRevalidate: mutate,
  };
}
