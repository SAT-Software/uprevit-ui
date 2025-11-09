import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getAllProjects({
  signal,
  auth,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
}) {
  const response = await fetch("/api/projects", {
    headers: {
      Authorization: `Bearer ${auth?.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch projects");
  }
  const data = await response.json();
  return data;
}

export function useGetAllProjects() {
  const auth = useAuth();

  return useQuery({
    queryKey: ["all-projects"],
    queryFn: ({ signal }) => getAllProjects({ signal, auth }),
    enabled: auth.isAuthenticated,
  });
}
