import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { getResponseErrorMessage } from "@/lib/api-error";
import type { SupportAttachmentView } from "@/types/support";

export class SupportAttachmentError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export function useGetSupportAttachment(attachmentId: string) {
  const auth = useAuth();
  const accessToken = auth.user?.access_token;

  return useQuery({
    queryKey: ["support", "attachment", attachmentId, auth.user?.profile.sub],
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/support/attachments/${encodeURIComponent(attachmentId)}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
          signal,
        },
      );
      if (!response.ok) {
        throw new SupportAttachmentError(
          await getResponseErrorMessage(response, "Failed to load screenshot"),
          response.status,
        );
      }
      const data = (await response.json()) as { result: SupportAttachmentView };
      return data.result;
    },
    enabled: Boolean(attachmentId) && auth.isAuthenticated && Boolean(accessToken),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
