import useSWR from "swr";
import { fetcherWithConfig } from "./api.client";
import { PaginationResult } from "prisma-paginate";
import { OutputWithProject } from "../types/types";

export default function useOutputs(page: number) {
  const { data, error, isLoading } = useSWR(
    page ? ["/api/output", { params: { page } }] : null,
    fetcherWithConfig
  );

  const queryResponse: PaginationResult<OutputWithProject> = data;

  return {
    outputsResponse: queryResponse,
    outputsLoading: isLoading,
    outputsError: error,
  };
}
