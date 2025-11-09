import { useQuery } from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";

async function getAllSourceFileFolders({
  signal,
  auth,
}: {
  signal: AbortSignal;
  auth: AuthContextProps;
}) {
  const res = await fetch(
    "/api/source-files?workspaceId=68d2be511ad93c69d6e39e51",
    {
      headers: {
        Authorization: `Bearer ${auth?.user?.access_token}`,
        "Content-Type": "application/json",
      },
      signal,
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to fetch source files folders");
  }
  return res.json();
}

export function useGetAllSourceFileFolders() {
  const auth = useAuth();

  return useQuery({
    queryKey: ["source-files-folders"],
    queryFn: ({ signal }) => getAllSourceFileFolders({ signal, auth }),
    enabled: auth.isAuthenticated,
  });
}
