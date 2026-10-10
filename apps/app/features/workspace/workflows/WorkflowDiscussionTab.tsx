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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@uprevit/ui/components/ui/toggle-group";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { ProductMemberAvatar } from "@/features/workspace/products/ProductMemberAvatar";
import {
  useAddWorkflowComment,
  useWorkflowDiscussion,
} from "@/hooks/workflow/useWorkflows";
import { useWorkflowAttachmentUploads } from "@/hooks/workflow/useWorkflowAttachmentUploads";
import type {
  WorkflowDetail,
  WorkflowDiscussionItem,
  WorkflowDiscussionKind,
  WorkflowDiscussionScope,
} from "@/types/workflow";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";
import { AddressRequestDialog } from "./AddressRequestDialog";
import {
  WorkflowAttachButton,
  WorkflowAttachmentGallery,
  WorkflowAttachmentUploadList,
} from "./WorkflowAttachments";
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
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="min-w-0 truncate text-sm font-medium">
            <span title={item.authorSnapshot.email}>
              {item.authorSnapshot.name}
            </span>
            {functionLabel ? (
              <span className="font-normal text-muted-foreground">
                {" "}
                as {functionLabel}
              </span>
            ) : null}
          </p>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {isRequest ? (
              <Badge
                variant={addressed ? "teal" : "orange"}
                className="font-normal"
              >
                {addressed ? "Request addressed" : "Change request"}
              </Badge>
            ) : null}
            <WorkflowScopeChip
              scope={item.scope}
              products={workflow.products}
            />
            <time
              dateTime={item.createdAt}
              className="text-xs text-muted-foreground tabular-nums"
            >
              {formatToLocalDateTime(item.createdAt)}
            </time>
          </div>
        </div>
        <div className="flex items-start justify-between gap-4">
          <p className="min-w-0 whitespace-pre-wrap break-words text-sm text-foreground/90">
            {item.body}
          </p>
          {canAddress ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="shrink-0"
              onClick={() => onAddress(item)}
            >
              <Icon icon={MessageDone01Icon} size={14} />
              Mark Addressed
            </Button>
          ) : null}
        </div>
        <WorkflowAttachmentGallery attachments={item.attachments} />
        {addressed && item.addressedBySnapshot ? (
          <div className="space-y-1 rounded-lg border border-border bg-muted/40 px-3 py-2">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <Icon icon={MessageDone01Icon} size={12} />
                <span
                  className="font-medium text-foreground"
                  title={item.addressedBySnapshot.email}
                >
                  {item.addressedBySnapshot.name}
                </span>
                addressed this
              </p>
              {item.addressedAt ? (
                <time dateTime={item.addressedAt} className="tabular-nums">
                  {formatToLocalDateTime(item.addressedAt)}
                </time>
              ) : null}
            </div>
            <p className="whitespace-pre-wrap break-words text-sm text-foreground/80">
              {item.addressNote}
            </p>
          </div>
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
  const uploads = useWorkflowAttachmentUploads(workflow._id);
  const trimmed = body.trim();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!trimmed || uploads.isUploading) return;
    addComment(
      { body: trimmed, scope, attachments: uploads.keys },
      {
        onSuccess: () => {
          setBody("");
          uploads.reset();
        },
      },
    );
  };

  return (
    <form onSubmit={submit} className="border-t border-border bg-muted/30 p-4">
      <InputGroup size="md" className="bg-background">
        <InputGroupTextarea
          aria-label="Comment"
          placeholder="Write a comment, or paste a screenshot"
          className="min-h-20 resize-none"
          maxLength={COMMENT_MAX_LENGTH}
          value={body}
          disabled={isPending}
          onChange={(event) => setBody(event.target.value)}
          onPaste={uploads.onPaste}
        />
        {uploads.attachments.length > 0 || uploads.isUploading ? (
          <InputGroupAddon align="block-end" className="pt-0">
            <WorkflowAttachmentUploadList
              uploads={uploads}
              disabled={isPending}
            />
          </InputGroupAddon>
        ) : null}
        <InputGroupAddon
          align="block-end"
          className="justify-between gap-2 border-t border-border"
        >
          <div className="flex min-w-0 items-center gap-1">
            <WorkflowScopeSelect
              products={workflow.products}
              value={scope}
              disabled={isPending}
              className="w-auto max-w-64"
              onValueChange={setScope}
            />
            <WorkflowAttachButton uploads={uploads} disabled={isPending} />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!trimmed || isPending || uploads.isUploading}
          >
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
    workflow.status === "in_review" || workflow.status === "ready_to_complete";
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
          <InfoTooltip content="Comments and change requests on one Product or the whole workflow. Only change requests and their answers send notifications." />
        </div>
        {!isDraft ? (
          <ToggleGroup
            type="single"
            value={filter}
            onValueChange={(value) =>
              value && setFilter(value as typeof filter)
            }
            aria-label="Filter discussion"
            className="h-7 gap-0.5 rounded-lg border border-input bg-muted p-0.5"
          >
            {FILTERS.map(({ value, label }) => (
              <ToggleGroupItem
                key={value}
                value={value}
                className="h-[22px] min-w-0 rounded-md px-2 text-xs text-muted-foreground/50 hover:bg-transparent hover:text-foreground aria-checked:bg-background aria-checked:text-foreground data-[state=on]:bg-background aria-checked:shadow-sm aria-checked:ring-1 aria-checked:ring-border dark:aria-checked:bg-input/50 dark:data-[state=on]:bg-input/50"
              >
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
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
