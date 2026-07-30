import { AuthContextProps } from "react-oidc-context";
import { WORKSPACE_LIST_LIMIT } from "@/lib/workspace-list-query";

export type GetProductVersionsParams = {
  signal: AbortSignal;
  auth: AuthContextProps;
  productId: string;
  page?: number;
  limit?: number;
};

export async function getProductVersions({
  signal,
  auth,
  productId,
  page = 1,
  limit = WORKSPACE_LIST_LIMIT,
}: GetProductVersionsParams) {
  const workspaceId = auth?.user?.profile?.workspaceId;
  const params = new URLSearchParams({
    workspaceId: String(workspaceId ?? ""),
    id: productId,
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(`/api/products/versions?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch product versions");
  }

  return response.json();
}
