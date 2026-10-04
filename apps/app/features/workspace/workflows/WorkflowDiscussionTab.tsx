"use client";

import { useState } from "react";
import {
  AlertCircleIcon,
  BubbleChatIcon,
  MessageDone01Icon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@uprevit/ui/components/ui/input-group";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@uprevit/ui/components/ui/tabs";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { ProductMemberAvatar } from "@/features/workspace/products/ProductMemberAvatar";
import {
  useAddWorkflowComment,
  useWorkflowDiscussion,
} from "@/hooks/workflow/useWorkflows";
import type {
  WorkflowDetail,
  WorkflowDiscussionItem,
  WorkflowDiscussionKind,
  WorkflowDiscussionScope,
} from "@/types/workflow";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";
import { AddressRequestDialog } from "./AddressRequestDialog";
import { WorkflowScopeChip, WorkflowScopeSelect } from "./WorkflowScope";

const COMMENT_MAX_LENGTH = 1000;

const FILTERS: { value: "all" | WorkflowDiscussionKind; label: string }[] = [
  { value: "all", label: "All" },
  { value: "change_request", label: "Requests" },
  { value: "comment", label: "Comments" },
];

function DiscussionItem({
  item,
  workflow,
  canAddress,
  onAddress,
}: {
  item: WorkflowDiscussionItem;
  workflow: WorkflowDetail;
  canAddress: boolean;
  onAddress: (item: WorkflowDiscussionItem) => void;
}) {
  const isRequest = item.kind === "change_request";
  const addressed = item.status === "addressed";
  const functionLabel = workflow.assignments.find(
    (assignment) => assignment._id === item.assignmentId,
  )?.functionLabel;

  return (
    <li className="flex gap-3 px-4 py-3">
      <ProductMemberAvatar
        member={{ name: item.authorSnapshot.name }}
        className="mt-0.5 size-7"
      />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className="text-sm font-medium"
            title={item.authorSnapshot.email}
          >
            {item.authorSnapshot.name}
            {functionLabel ? (
              <span className="font-normal text-muted-foreground">
                {" "}
                as {functionLabel}
              </span>
            ) : null}
          </span>
          {isRequest ? (
            <Badge
              variant={addressed ? "teal" : "orange"}
              className="font-normal"
            >
              {addressed ? "Request addressed" : "Change request"}
            </Badge>
          ) : null}
          <WorkflowScopeChip scope={item.scope} products={workflow.products} />
          <span className="text-xs text-muted-foreground">
            {formatToLocalDateTime(item.createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap break-words text-sm text-foreground/90">
          {item.body}
        </p>
        {addressed && item.addressedBySnapshot ? (
          <div className="space-y-1 rounded-lg border border-border bg-muted/40 px-3 py-2">
            <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
              <Icon icon={MessageDone01Icon} size={12} />
              <span
                className="font-medium text-foreground"
                title={item.addressedBySnapshot.email}
              >
                {item.addressedBySnapshot.name}
              </span>
              addressed this
              {item.addressedAt
                ? ` · ${formatToLocalDateTime(item.addressedAt)}`
                : null}
            </p>
            <p className="whitespace-pre-wrap break-words text-sm text-foreground/80">
              {item.addressNote}
            </p>
          </div>
        ) : null}
        {canAddress ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onAddress(item)}
          >
            <Icon icon={MessageDone01Icon} size={14} />
            Mark Addressed
          </Button>
        ) : null}
      </div>
    </li>
  );
}

function CommentComposer({ workflow }: { workflow: WorkflowDetail }) {
  const [body, setBody] = useState("");
  const [scope, setScope] = useState<WorkflowDiscussionScope>({
    type: "package",
  });
  const { mutate: addComment, isPending } = useAddWorkflowComment(workflow._id);
  const trimmed = body.trim();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!trimmed) return;
    addComment({ body: trimmed, scope }, { onSuccess: () => setBody("") });
  };

  return (
    <form onSubmit={submit} className="border-t border-border bg-muted/30 p-4">
      <InputGroup size="md" className="bg-background">
        <InputGroupTextarea
          aria-label="Comment"
          placeholder="Write a comment"
          className="min-h-20 resize-none"
          maxLength={COMMENT_MAX_LENGTH}
          value={body}
          disabled={isPending}
          onChange={(event) => setBody(event.target.value)}
        />
        <InputGroupAddon
          align="block-end"
          className="justify-between gap-2 border-t border-border"
        >
          <WorkflowScopeSelect
            products={workflow.products}
            value={scope}
            disabled={isPending}
            className="w-auto max-w-64"
            onValueChange={setScope}
          />
          <Button type="submit" size="sm" disabled={!trimmed || isPending}>
            <Icon icon={SentIcon} size={14} />
            {isPending ? "Posting…" : "Comment"}
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}

export function WorkflowDiscussionTab({
  workflow,
}: {
  workflow: WorkflowDetail;
}) {
  const [filter, setFilter] = useState<"all" | WorkflowDiscussionKind>("all");
  const [addressOpen, setAddressOpen] = useState(false);
  const [addressTarget, setAddressTarget] =
    useState<WorkflowDiscussionItem | null>(null);
  const isDraft = workflow.status === "draft";
  const isActive =
    workflow.status === "in_review" ||
    workflow.status === "ready_to_complete";
  const { data, isPending, isError } = useWorkflowDiscussion(
    workflow._id,
    workflow.status,
    filter === "all" ? undefined : filter,
  );
  const items = data?.items ?? [];

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Discussion</p>
          <InfoTooltip content="Comments and change requests on one Product or the whole package. Only change requests and their answers send notifications." />
        </div>
        {!isDraft ? (
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as typeof filter)}
          >
            <TabsList className="h-7">
              {FILTERS.map(({ value, label }) => (
                <TabsTrigger key={value} value={value} className="text-xs">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : null}
      </div>
      {isDraft ? (
        <EmptyDiscussion text="Discussion opens when the workflow starts." />
      ) : isPending ? (
        <div className="space-y-4 p-4">
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="flex gap-3">
              <Skeleton className="size-7 rounded-full" />
              <div className="flex-1 space-y-1.5 pt-1">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-full max-w-md" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
          <Icon icon={AlertCircleIcon} size={16} />
          Failed to load discussion
        </div>
      ) : items.length === 0 ? (
        <EmptyDiscussion
          text={
            filter === "change_request"
              ? "No change requests."
              : filter === "comment"
                ? "No comments yet."
                : "No comments or change requests yet."
          }
        />
      ) : (
        <ol className="divide-y divide-border">
          {items.map((item) => (
            <DiscussionItem
              key={item._id}
              item={item}
              workflow={workflow}
              canAddress={isActive && item.canAddress}
              onAddress={(target) => {
                setAddressTarget(target);
                setAddressOpen(true);
              }}
            />
          ))}
        </ol>
      )}
      {isActive && data?.canComment ? (
        <CommentComposer workflow={workflow} />
      ) : null}

      {isActive && addressTarget ? (
        <AddressRequestDialog
          workflowId={workflow._id}
          item={addressTarget}
          open={addressOpen}
          onOpenChange={setAddressOpen}
        />
      ) : null}
    </section>
  );
}

function EmptyDiscussion({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
      <Icon icon={BubbleChatIcon} size={16} />
      {text}
    </div>
  );
}
