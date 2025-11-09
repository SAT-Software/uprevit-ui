import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

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
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch department");
  }
  const data = await response.json();
  return data;
}

export function useGetDepartmentById(departmentId: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["department", departmentId],
    queryFn: ({ signal }) => getDepartmentById(departmentId, { signal, auth }),
    enabled: auth.isAuthenticated,
  });
}
