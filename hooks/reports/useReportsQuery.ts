import { useMutation } from "@tanstack/react-query";
import { useAuth, AuthContextProps } from "react-oidc-context";
import { ReportsQueryRequest } from "@/types/reports";

async function executeReportsQuery({
  payload,
  auth,
}: {
  payload: ReportsQueryRequest;
  auth: AuthContextProps;
}) {
  const response = await fetch("/api/reports/query", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      workspaceId: auth?.user?.profile?.workspaceId,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to execute reports query");
  }

  return response.json();
}

export function useReportsQuery() {
  const auth = useAuth();

  return useMutation({
    mutationFn: (payload: Omit<ReportsQueryRequest, "workspaceId">) =>
      executeReportsQuery({
        payload: {
          ...payload,
          workspaceId: auth?.user?.profile?.workspaceId as string,
        },
        auth,
      }),
  });
}
