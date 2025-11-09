import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getAllDepartments({
  signal,
  auth,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
}) {
  const response = await fetch("/api/departments", {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`, // Add your authorization header here
      "Content-Type": "application/json", // Example of another header
    },
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch departments");
  }
  const data = await response.json();
  return data;
}

export function useGetAllDepartments() {
  const auth = useAuth();
  return useQuery({
    queryKey: ["all-departments"],
    queryFn: ({ signal }) => getAllDepartments({ signal, auth }),
    enabled: auth.isAuthenticated,
  });
}
