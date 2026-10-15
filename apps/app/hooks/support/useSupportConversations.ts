import { useLayoutEffect, useRef } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import posthog from "posthog-js";
import { isSupportIdentityCurrent } from "@/lib/posthog/support";
import { useSupportPrincipal } from "@/hooks/support/useSupportPrincipal";
import type { SupportConfig } from "@/types/support";

const POLL_INTERVAL = 15_000;
const TICKETS_PAGE_SIZE = 20;

const UNAVAILABLE_MESSAGE =
  "Your conversations are unavailable right now. Please try again in a moment.";

export function useSupportConversationsClient(config: SupportConfig | undefined) {
  const { principal, isCurrent } = useSupportPrincipal();
  const currentConfig = useRef(config);
  useLayoutEffect(() => {
    currentConfig.current = config;
    return () => {
      currentConfig.current = undefined;
    };
  }, [config]);

  const getConversations = () => {
    if (
      !isCurrent() || !config?.identityHash ||
      currentConfig.current?.distinctId !== config.distinctId ||
      currentConfig.current?.identityHash !== config.identityHash ||
      !posthog.__loaded || !isSupportIdentityCurrent(config.distinctId, config.identityHash) ||
      !posthog.conversations?.isAvailable()
    ) {
      throw new Error(UNAVAILABLE_MESSAGE);
    }
    return posthog.conversations;
  };
  return { principal, getConversations };
}

export function useSupportTickets(config: SupportConfig | undefined, enabled: boolean) {
  const { principal, getConversations } = useSupportConversationsClient(config);
  return useInfiniteQuery({
    queryKey: ["support", "tickets", principal],
    queryFn: async ({ pageParam }) => {
      const result = await getConversations().getTickets({
        limit: TICKETS_PAGE_SIZE,
        offset: pageParam,
      });
      getConversations();
      if (!result) throw new Error(UNAVAILABLE_MESSAGE);
      return result;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastOffset) => {
      const nextOffset = lastOffset + lastPage.results.length;
      return lastPage.results.length && nextOffset < lastPage.count ? nextOffset : undefined;
    },
    select: (data) => [
      ...new Map(data.pages.flatMap((page) => page.results).map((ticket) => [ticket.id, ticket])).values(),
    ],
    enabled: enabled && Boolean(config?.identityHash),
    staleTime: 0,
    refetchInterval: POLL_INTERVAL,
  });
}

export function useSupportTicketMessages(
  config: SupportConfig | undefined,
  ticketId: string | null,
) {
  const { principal, getConversations } = useSupportConversationsClient(config);
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["support", "messages", principal, ticketId],
    queryFn: async () => {
      const conversations = getConversations();
      const result = await conversations.getMessages(ticketId!);
      getConversations();
      if (!result) throw new Error(UNAVAILABLE_MESSAGE);
      if (result.unread_count > 0) {
        void conversations
          .markAsRead(ticketId!)
          .then((response) => {
            if (response) void queryClient.invalidateQueries({ queryKey: ["support", "tickets", principal] });
          })
          .catch(() => undefined);
      }
      return result.messages.filter((message) => !message.is_private);
    },
    enabled: Boolean(ticketId && config?.identityHash),
    staleTime: 0,
    refetchInterval: POLL_INTERVAL,
  });
}

export function useReplySupportMessage(config: SupportConfig | undefined, ticketId: string) {
  const { principal, getConversations } = useSupportConversationsClient(config);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) => {
      const conversations = getConversations();
      const messages = await conversations.getMessages(ticketId);
      getConversations();
      if (!messages || conversations.getCurrentTicketId() !== ticketId) {
        throw new Error("The conversation changed. Please try again.");
      }
      const response = await conversations.sendMessage(message.trim(), undefined, false);
      getConversations();
      if (!response || response.ticket_id !== ticketId) throw new Error(UNAVAILABLE_MESSAGE);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support", "messages", principal, ticketId] });
      queryClient.invalidateQueries({ queryKey: ["support", "tickets", principal] });
    },
  });
}
