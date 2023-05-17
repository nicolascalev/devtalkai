import useSWR from "swr";
import { basicFetcher } from "./api.client";
import { UserWithNestedProperties } from "../types/types";

export function useProfile() {
  const { data, isLoading, error, mutate } = useSWR(
    "/api/profile/me",
    basicFetcher
  );
  const user: UserWithNestedProperties | null = data;
  return {
    user,
    userLoading: isLoading,
    userLoadingError: error,
    userRevalidate: mutate,
  };
}
