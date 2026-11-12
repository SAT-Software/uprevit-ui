import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { getResponseError } from "@/lib/api-error";

async function getDepartmentById(
  departmentId: string,
  {
    signal,
    auth,
  }: {
    signal: AbortSignal;
    auth: AuthContextProps;
  }
) {
  const response = await fetch(`/api/departments/${departmentId}`, {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });
  if (!response.ok) {
    throw await getResponseError(response, "Failed to fetch department");
  }
  const data = await response.json();
  return data;
}

export function useGetDepartmentById(departmentId: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["department", departmentId],
    queryFn: ({ signal }) => getDepartmentById(departmentId, { signal, auth }),
    enabled: auth.isAuthenticated && !!departmentId,
  });
}
