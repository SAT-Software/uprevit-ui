"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth, type AuthContextProps } from "react-oidc-context";
import type { DocumentationVideoSignedUrlResponse } from "@/types/documentation-video";

const REFRESH_BUFFER_MS = 2 * 60 * 1000;

function getStaleTimeMs(expiresAt: string): number {
  const expiresMs = new Date(expiresAt).getTime();
  const staleMs = expiresMs - Date.now() - REFRESH_BUFFER_MS;
  return Math.max(staleMs, 0);
}

async function fetchDocumentationVideoUrl({
  videoKey,
  signal,
  auth,
}: {
  videoKey: string;
  signal: AbortSignal;
  auth: AuthContextProps;
}) {
  const accessToken = auth.user?.access_token;
  if (!accessToken) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(
    `/api/docs/videos/${encodeURIComponent(videoKey)}/signed-url`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal,
    },
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to load documentation video");
  }

  return (await response.json()) as DocumentationVideoSignedUrlResponse;
}

export function useDocumentationVideoUrl(videoKey: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: ["docs-video-url", videoKey],
    queryFn: async ({ signal }) => {
      const data = await fetchDocumentationVideoUrl({ videoKey, signal, auth });
      return data.result;
    },
    enabled: auth.isAuthenticated && Boolean(videoKey),
    staleTime: (query) => {
      const expiresAt = query.state.data?.expiresAt;
      if (!expiresAt) return 0;
      return getStaleTimeMs(expiresAt);
    },
    gcTime: 0,
  });
}
