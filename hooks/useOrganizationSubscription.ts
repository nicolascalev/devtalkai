import useSWR from "swr";
import { basicFetcher } from "./api.client";

type SubscriptionLimits =
  | {
      subscriptionStatus: string;
      memberLimit: number;
      projectLimit: number;
    }
  | undefined;

export default function useOrganizationSubscription(
  organizationId: number | null | undefined
) {
  const { data, isLoading, error } = useSWR(
    organizationId ? "/api/organization/limits" : null,
    basicFetcher
  );

  const result: SubscriptionLimits = data;

  return {
    subscription: result,
    subscriptionLoading: isLoading,
    subscriptionLoadingError: error,
  };
}
