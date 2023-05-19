import useSWR from "swr";
import { basicFetcher } from "./api.client";
import { InviteWithOrganization } from "../types/types";

export default function useUserInvites() {
  const { data, isLoading, error, mutate } = useSWR(
    "/api/profile/invites",
    basicFetcher
  );

  const responseData: InviteWithOrganization[] = data;

  return {
    invites: responseData,
    invitesLoading: isLoading,
    invitesLoadingError: error,
    invitesRevalidate: mutate,
  };
}
