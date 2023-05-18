import useSWR from "swr";
import { useStoreState } from "../store";
import { fetcherWithConfig } from "./api.client";
import { PaginationResult } from "prisma-paginate";
import { Invite } from "@prisma/client";

export default function useOrganizationInvites(
  email: string,
  page: number | undefined
) {
  const user = useStoreState((state) => state.user);
  const { data, isLoading, error, mutate } = useSWR(
    user?.adminOf
      ? [
          `/api/organization/${user.adminOf.id}/invites`,
          { params: { email, page } },
        ]
      : null,
    fetcherWithConfig
  );

  const responseData: PaginationResult<Invite> = data;

  return {
    organizationInvitesResponse: responseData,
    organizationInvitesData: responseData?.result,
    organizationInvitesLoading: isLoading,
    organizationInvitesError: error,
    organizationInvitesRevalidate: mutate,
  };
}
