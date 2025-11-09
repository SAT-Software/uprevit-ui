import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getArchivedDepartments({
  signal,
  auth,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
}) {
  const response = await fetch("/api/departments?isArchive=true", {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch archived departments");
  }
  const data = await response.json();
  return data;
}

export function useGetArchivedDepartments() {
  const auth = useAuth();

  return useQuery({
    queryKey: ["archived-departments"],
    queryFn: ({ signal }) => getArchivedDepartments({ signal, auth }),
    enabled: auth.isAuthenticated,
  });
}
