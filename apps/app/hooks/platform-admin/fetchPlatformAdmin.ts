import type { AuthContextProps } from "react-oidc-context";
import { getResponseErrorMessage } from "@/lib/api-error";

export async function fetchPlatformAdmin<T>(
  path: string,
  {
    auth,
    signal,
    method = "GET",
    body,
  }: {
    auth: AuthContextProps;
    signal?: AbortSignal;
    method?: string;
    body?: unknown;
  },
): Promise<T> {
  const token = auth.user?.access_token;
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!response.ok) {
    throw new Error(
      await getResponseErrorMessage(response, "Platform admin request failed"),
    );
  }

  const json = await response.json();
  return json.data as T;
}
