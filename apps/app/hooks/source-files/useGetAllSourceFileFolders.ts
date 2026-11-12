import { useQuery } from "@tanstack/react-query";
import {
  buildListSearchParams,
  ListQueryParams,
} from "@/lib/workspace-list-query";
import type { SourceFilesFoldersApiResponse } from "@/types/source-files";
import { parseSourceFilesFoldersListResponse } from "@/utils/source-files-list-response";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { getResponseError } from "@/lib/api-error";

export const SOURCE_FILES_LIST_LIMIT = 24;

export async function getAllSourceFileFolders({
  signal,
  auth,
  query,
  productId,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
  query?: ListQueryParams;
  productId?: string;
}): Promise<SourceFilesFoldersApiResponse> {
  const params = buildListSearchParams(
    auth.user?.profile?.workspaceId as string | undefined,
    query,
  );

  if (productId) {
    params.set("productId", productId);
  }

  const res = await fetch(`/api/source-files?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });
  if (!res.ok) {
    throw await getResponseError(res, "Failed to fetch source files folders");
  }

  const data: unknown = await res.json();
  const result = parseSourceFilesFoldersListResponse(
    data,
    query?.limit ?? SOURCE_FILES_LIST_LIMIT,
  );

  const payload = data as { message?: string } | null;

  return {
    message: payload?.message,
    result,
  };
}

type UseGetAllSourceFileFoldersOptions = {
  productId?: string;
  query?: ListQueryParams;
  enabled?: boolean;
};

export function useGetAllSourceFileFolders(
  options?: UseGetAllSourceFileFoldersOptions,
) {
  const auth = useAuth();
  const productId = options?.productId;
  const query = options?.query;
  const enabled = options?.enabled ?? true;

  return useQuery<SourceFilesFoldersApiResponse>({
    queryKey: ["source-files-folders", productId || "all", query],
    queryFn: ({ signal }) =>
      getAllSourceFileFolders({ signal, auth, query, productId }),
    enabled: auth.isAuthenticated && enabled,
  });
}
