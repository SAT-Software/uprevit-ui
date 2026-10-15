"use client";

import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import type { TicketStatus } from "posthog-js";
import {
  AlertCircleIcon,
  ArrowLeft01Icon,
  MessageMultiple01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { InputGroup, InputGroupTextarea } from "@uprevit/ui/components/ui/input-group";
import { cn } from "@uprevit/ui/lib/utils";
import {
  useSupportTicketMessages,
  useSupportTickets,
  useReplySupportMessage,
} from "@/hooks/support/useSupportConversations";
import { useSupportPrincipal } from "@/hooks/support/useSupportPrincipal";
import type { SupportConfig } from "@/types/support";

const STATUS_BADGES: Record<
  TicketStatus,
  { label: string; variant: "blue" | "green" | "yellow" | "gray" }
> = {
  new: { label: "New", variant: "blue" },
  open: { label: "Open", variant: "green" },
  pending: { label: "Waiting on you", variant: "yellow" },
  on_hold: { label: "On hold", variant: "gray" },
  resolved: { label: "Resolved", variant: "gray" },
};

const timeAgo = (value?: string) =>
  value ? formatDistanceToNowStrict(new Date(value), { addSuffix: true }) : "";

function PanelMessage({
  title,
  description,
  onRetry,
}: {
  title: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-accent/80 text-muted-foreground/60">
        <Icon icon={onRetry ? AlertCircleIcon : MessageMultiple01Icon} size={18} strokeWidth={2} />
      </div>
      <p className="text-sm font-medium">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {onRetry ? (
        <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
          <Icon icon={RefreshIcon} size={14} strokeWidth={2} />
          Try again
        </Button>
      ) : null}
    </div>
  );
}

function SupportTicketThread({
  config,
  ticketId,
  resolved,
  onBack,
}: {
  config: SupportConfig | undefined;
  ticketId: string;
  resolved: boolean;
  onBack: () => void;
}) {
  const { data: messages, isLoading, error: queryError, refetch } =
    useSupportTicketMessages(config, ticketId);
  const error = messages ? null : queryError;
  const [reply, setReply] = useState("");
  const sendReply = useReplySupportMessage(config, ticketId);
  const { isCurrent } = useSupportPrincipal();
  const busy = isLoading || sendReply.isPending || !config?.identityHash;

  return (
    <div className="flex flex-col">
      <div className="flex h-10 items-center gap-2 border-b border-border px-2">
        <Button type="button" variant="ghost" size="sm" onClick={onBack} disabled={sendReply.isPending}>
          <Icon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
          All conversations
        </Button>
      </div>
      {isLoading || !config?.identityHash ? (
        <div className="flex flex-col gap-3 p-4">
          <Skeleton className="h-14 w-3/4" />
          <Skeleton className="ml-auto h-14 w-2/3" />
        </div>
      ) : error ? (
        <PanelMessage title="Could not load messages" description={error.message} onRetry={() => refetch()} />
      ) : (
        <ol className="flex flex-col gap-3 p-4">
          {messages?.map((message) => {
            const fromCustomer = message.author_type === "customer";
            return (
              <li
                key={message.id}
                className={cn("flex max-w-[85%] flex-col gap-1", fromCustomer && "ml-auto items-end")}
              >
                <span className="text-xs text-muted-foreground">
                  {fromCustomer ? "You" : message.author_name || "Uprevit team"} · {timeAgo(message.created_at)}
                </span>
                <div
                  className={cn(
                    "whitespace-pre-wrap break-words rounded-xl border px-3 py-2 text-sm",
                    fromCustomer ? "border-primary/20 bg-primary/10" : "border-border bg-muted/60",
                  )}
                >
                  {message.content}
                </div>
              </li>
            );
          })}
        </ol>
      )}
      {resolved ? (
        <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
          This conversation is resolved. Send a new message if you need more help.
        </p>
      ) : (
        <form
          className="flex flex-col gap-2 border-t border-border p-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (busy || error || !reply.trim()) return;
            sendReply.mutate(reply, {
              onSuccess: () => { if (isCurrent()) setReply(""); },
            });
          }}
        >
          <InputGroup>
            <InputGroupTextarea
              aria-label="Reply to this conversation"
              placeholder="Add a reply…"
              value={reply}
              maxLength={5000}
              rows={3}
              onChange={(event) => setReply(event.target.value)}
              disabled={busy || Boolean(error)}
            />
          </InputGroup>
          {sendReply.error ? <p role="alert" className="text-sm text-destructive">{sendReply.error.message}</p> : null}
          <Button type="submit" size="sm" className="self-end" disabled={busy || Boolean(error) || !reply.trim()}>
            {sendReply.isPending ? "Sending…" : "Send reply"}
          </Button>
        </form>
      )}
    </div>
  );
}

export function SupportConversationsPanel({
  config,
  enabled,
}: {
  config: SupportConfig | undefined;
  enabled: boolean;
}) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const {
    data: tickets,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useSupportTickets(config, enabled);

  if (selectedTicketId) {
    return (
      <SupportTicketThread
        key={selectedTicketId}
        config={config}
        ticketId={selectedTicketId}
        resolved={tickets?.find((ticket) => ticket.id === selectedTicketId)?.status === "resolved"}
        onBack={() => setSelectedTicketId(null)}
      />
    );
  }

  if (!config?.identityHash) {
    return (
      <PanelMessage
        title="Conversations are not available yet"
        description="Support settings are loading or unavailable. Please try again in a moment."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error && !tickets) {
    return <PanelMessage title="Could not load conversations" description={error.message} onRetry={() => refetch()} />;
  }

  if (!tickets?.length) {
    return (
      <PanelMessage
        title="No conversations yet"
        description="Messages you send and replies from the Uprevit team will show up here."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2 p-4">
      {tickets.map((ticket) => {
        const status = STATUS_BADGES[ticket.status] ?? STATUS_BADGES.open;
        return (
          <li key={ticket.id}>
            <button
              type="button"
              onClick={() => setSelectedTicketId(ticket.id)}
              className="flex w-full items-start gap-3 rounded-lg border border-border bg-background p-3 text-left transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <p className="line-clamp-2 text-sm">{ticket.last_message || "No messages yet"}</p>
                <p className="text-xs text-muted-foreground">
                  {timeAgo(ticket.last_message_at ?? ticket.created_at)} · {ticket.message_count}{" "}
                  {ticket.message_count === 1 ? "message" : "messages"}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge variant={status.variant}>{status.label}</Badge>
                {ticket.unread_count ? (
                  <span className="text-xs font-medium text-primary">
                    {ticket.unread_count} new {ticket.unread_count === 1 ? "reply" : "replies"}
                  </span>
                ) : null}
              </div>
            </button>
          </li>
        );
      })}
      {hasNextPage ? (
        <li className="flex flex-col items-center gap-1">
          {isFetchNextPageError ? (
            <p role="alert" className="text-sm text-destructive">Could not load older conversations.</p>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading…" : isFetchNextPageError ? "Try again" : "Load older conversations"}
          </Button>
        </li>
      ) : null}
    </ul>
  );
}
