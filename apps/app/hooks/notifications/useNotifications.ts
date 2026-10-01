import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";
import type { GetNotificationsResponse } from "@/types/notification";

const NOTIFICATIONS_QUERY_KEY = ["notifications"];

export const NOTIFICATIONS_PREVIEW_LIMIT = 6;

type MarkNotificationsRead = { ids: string[] } | { all: true };

async function getNotifications(
  params: { page?: number; limit: number; unread?: boolean },
  { signal, auth }: { signal: AbortSignal; auth: AuthContextProps },
): Promise<GetNotificationsResponse> {
  const search = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit),
  });
  if (params.unread) search.set("unread", "true");

  const res = await fetch(`/api/notifications?${search.toString()}`, {
    headers: {
      Authorization: `Bearer ${auth.user?.access_token}`,
      "Content-Type": "application/json",
    },
    signal,
  });
  if (!res.ok) {
    throw new Error(
      await getResponseErrorMessage(res, "Failed to fetch notifications"),
    );
  }
  return res.json();
}

export function useNotifications() {
  const auth = useAuth();

  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, "latest"],
    queryFn: ({ signal }) =>
      getNotifications(
        { limit: NOTIFICATIONS_PREVIEW_LIMIT },
        { signal, auth },
      ),
    enabled: auth.isAuthenticated,
    refetchInterval: 60_000,
  });
}

export function useNotificationsInfinite({ unread }: { unread: boolean }) {
  const auth = useAuth();

  return useInfiniteQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, "list", { unread }],
    queryFn: ({ pageParam, signal }) =>
      getNotifications(
        { page: pageParam, limit: 20, unread },
        { signal, auth },
      ),
    initialPageParam: 1,
    getNextPageParam: ({ result: { pagination } }) =>
      pagination.hasNextPage ? pagination.currentPage + 1 : undefined,
    enabled: auth.isAuthenticated,
    refetchInterval: 60_000,
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: async (body: MarkNotificationsRead) => {
      const res = await fetch("/api/notifications/read", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(
            res,
            "Failed to mark notifications as read",
          ),
        );
      }
      return res.json();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to mark notifications as read"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
}
