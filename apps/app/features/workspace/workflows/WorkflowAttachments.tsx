"use client";

import { useRef } from "react";
import Image from "next/image";
import { Cancel01Icon, ImageAdd01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import {
  WORKFLOW_ATTACHMENT_ACCEPT,
  WORKFLOW_ATTACHMENT_LIMIT,
  type useWorkflowAttachmentUploads,
} from "@/hooks/workflow/useWorkflowAttachmentUploads";
import type { WorkflowDiscussionAttachment } from "@/types/workflow";

type AttachmentUploads = ReturnType<typeof useWorkflowAttachmentUploads>;

export function WorkflowAttachButton({
  uploads,
  disabled,
}: {
  uploads: AttachmentUploads;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Attach images"
            disabled={disabled || uploads.isFull}
            onClick={() => inputRef.current?.click()}
          >
            <Icon icon={ImageAdd01Icon} size={16} />
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={WORKFLOW_ATTACHMENT_ACCEPT}
            multiple
            hidden
            onChange={(event) => {
              void uploads.addFiles(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {uploads.isFull
          ? `Up to ${WORKFLOW_ATTACHMENT_LIMIT} images`
          : "Attach screenshots or images, or paste them into the text box"}
      </TooltipContent>
    </Tooltip>
  );
}

export function WorkflowAttachmentUploadList({
  uploads,
  disabled,
}: {
  uploads: AttachmentUploads;
  disabled?: boolean;
}) {
  if (uploads.attachments.length === 0 && uploads.uploading === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Attached images">
      {uploads.attachments.map((attachment) => (
        <li
          key={attachment.key}
          className="relative size-16 overflow-hidden rounded-md border border-border bg-muted"
        >
          <Image
            src={attachment.previewUrl}
            alt={attachment.name}
            fill
            unoptimized
            className="object-cover"
          />
          <Button
            type="button"
            size="icon-2xs"
            variant="secondary"
            aria-label={`Remove ${attachment.name}`}
            disabled={disabled}
            className="absolute right-0.5 top-0.5 rounded-full"
            onClick={() => uploads.remove(attachment.key)}
          >
            <Icon icon={Cancel01Icon} size={12} />
          </Button>
        </li>
      ))}
      {Array.from({ length: uploads.uploading }, (_, index) => (
        <li
          key={`uploading-${index}`}
          className="flex size-16 items-center justify-center rounded-md border border-dashed border-border bg-muted"
          aria-label="Uploading image"
        >
          <Spinner className="size-4" />
        </li>
      ))}
    </ul>
  );
}

export function WorkflowAttachmentGallery({
  attachments,
}: {
  attachments?: WorkflowDiscussionAttachment[];
}) {
  if (!attachments?.length) return null;

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Images">
      {attachments.map((attachment) => (
        <li key={attachment.key}>
          {attachment.url ? (
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open ${attachment.fileName}`}
              className="relative block h-24 w-36 overflow-hidden rounded-md border border-border bg-muted transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Image
                src={attachment.url}
                alt={attachment.fileName}
                fill
                unoptimized
                sizes="144px"
                className="object-cover"
              />
            </a>
          ) : (
            <div className="flex h-24 w-36 items-center justify-center rounded-md border border-dashed border-border px-2 text-center text-xs text-muted-foreground">
              Image unavailable
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
