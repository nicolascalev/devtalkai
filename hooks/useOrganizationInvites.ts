import useSWR from "swr";
import { useStoreState } from "../store";
import { fetcherWithConfig } from "./api.client";

export default function useOrganizationInvites(email: string, page: number | undefined) {
  const user = useStoreState((state) => state.user);
  const { data, isLoading, error } = useSWR(
    user?.adminOf
      ? [`/api/organization/${user.adminOf.id}/invites`, { params: { email, page } }]
      : null,
    fetcherWithConfig
  );

  return {
    organizationInvitesResponse: data,
    organizationInvitesData: data?.result,
    organizationInvitesLoading: isLoading,
    organizationInvitesError: error,
  };
}
