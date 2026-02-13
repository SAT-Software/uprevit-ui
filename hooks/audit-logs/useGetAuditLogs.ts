import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { AuditScopeType, GetAuditLogsResponse } from "@/types/audit-log";

export type GetAuditLogsFilters = {
  workspaceId: string;
  scopeType: AuditScopeType;
  scopeId?: string;
  page?: number;
  limit?: number;
  actions?: string[];
  search?: string;
  from?: string;
  to?: string;
};

async function getAuditLogs(
  filters: GetAuditLogsFilters,
  {
    signal,
    auth,
  }: {
    signal: AbortSignal;
    auth: AuthContextProps;
  },
): Promise<GetAuditLogsResponse> {
  const params = new URLSearchParams();
  params.set("workspaceId", filters.workspaceId);
  params.set("scopeType", filters.scopeType);
  const optionalParams: Array<[string, string | undefined]> = [
    ["scopeId", filters.scopeType !== "archive" ? filters.scopeId : undefined],
    ["page", filters.page ? filters.page.toString() : undefined],
    ["limit", filters.limit ? filters.limit.toString() : undefined],
    ["search", filters.search || undefined],
    ["from", filters.from || undefined],
    ["to", filters.to || undefined],
    [
      "actions",
      filters.actions?.length ? filters.actions.join(",") : undefined,
    ],
  ];

  for (const [key, value] of optionalParams) {
    if (value) params.set(key, value);
  }

  console.log("params", params.toString());

  const response = await fetch(`/api/audit-logs?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch audit logs");
  }

  return response.json();
}

export function useGetAuditLogs(filters: GetAuditLogsFilters) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: ({ signal }) => getAuditLogs(filters, { signal, auth }),
    enabled:
      auth.isAuthenticated &&
      Boolean(filters.workspaceId) &&
      Boolean(filters.scopeType) &&
      (filters.scopeType === "archive" || Boolean(filters.scopeId)),
  });
}
