"use client";

import Image from "next/image";
import {
  Doc01Icon,
  File02Icon,
  Pdf01Icon,
} from "@hugeicons/core-free-icons";
import {
  Delete02Icon,
  DownloadSquare01Icon,
  MoreVerticalSquare01Icon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@uprevit/ui/components/ui/dropdown-menu";
import { cn } from "@uprevit/ui/lib/utils";
import type { SourceFilesFolder } from "@/types/source-files";

type FileKind = "image" | "pdf" | "word" | "docx" | "doc" | "other";

function getFileKind(fileNameOrUrl: string, fileName?: string): FileKind {
  const urlLower = (fileNameOrUrl || "").toLowerCase();
  const nameLower = (fileName || "").toLowerCase();

  const isImageExtension = (str: string) =>
    str.endsWith(".png") ||
    str.endsWith(".jpg") ||
    str.endsWith(".jpeg") ||
    str.endsWith(".webp") ||
    str.endsWith(".gif") ||
    str.endsWith(".bmp") ||
    str.endsWith(".tif") ||
    str.endsWith(".tiff");

  const isPdfExtension = (str: string) =>
    str.endsWith(".pdf") || str.includes("application/pdf");

  const isWordExtension = (str: string) =>
    str.endsWith(".doc") ||
    str.endsWith(".docx") ||
    str.includes("application/msword") ||
    str.includes(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );

  if (isImageExtension(urlLower) || isImageExtension(nameLower)) {
    return "image";
  }
  if (isPdfExtension(urlLower) || isPdfExtension(nameLower)) {
    return "pdf";
  }
  if (isWordExtension(urlLower) || isWordExtension(nameLower)) {
    return "word";
  }

  return "other";
}

function FileTypeIcon({
  kind,
  className,
}: {
  kind: FileKind;
  className?: string;
}) {
  if (kind === "pdf") {
    return (
      <Icon
        icon={Pdf01Icon}
        size={20}
        strokeWidth={2}
        className={cn("text-muted-foreground/50", className)}
      />
    );
  }
  if (kind === "word") {
    return (
      <Icon
        icon={Doc01Icon}
        size={20}
        strokeWidth={2}
        className={cn("text-muted-foreground/50", className)}
      />
    );
  }
  return (
    <Icon
      icon={File02Icon}
      size={20}
      strokeWidth={2}
      className={cn("text-muted-foreground/50", className)}
    />
  );
}

interface SourceFilesItemsGridProps {
  files: SourceFilesFolder[];
  className?: string;
  onPreviewImage: (url: string, name: string) => void;
  onDelete: (fileId: string) => void;
  onDownload: (url: string, fileName: string) => void;
}

export function SourceFilesItemsGrid({
  files,
  className,
  onPreviewImage,
  onDelete,
  onDownload,
}: SourceFilesItemsGridProps) {
  if (!files.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
        className,
      )}
    >
      {files.map((file) => {
        const kind = getFileKind(file.url || "", file.name);
        const isImage = kind === "image" && file.url;

        return (
          <div key={file._id} className="group relative rounded-2xl">
            <div className="absolute inset-0 rounded-2xl bg-muted/0 transition-colors duration-200 group-hover:bg-muted/60" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 z-10 h-7 w-7 text-muted-foreground opacity-0 transition-opacity duration-200 hover:text-foreground group-hover:opacity-100 data-[state=open]:opacity-100"
                  aria-label="File actions"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Icon icon={MoreVerticalSquare01Icon} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={(event) => event.stopPropagation()}
              >
                <DropdownMenuItem
                  onClick={(event) => event.stopPropagation()}
                  onSelect={() => {
                    if (file.url) {
                      onDownload(file.url, file.name);
                    }
                  }}
                >
                  <Icon icon={DownloadSquare01Icon} />
                  <span>Download</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="group"
                  onClick={(event) => event.stopPropagation()}
                  onSelect={() => onDelete(file._id)}
                >
                  <Icon
                    icon={Delete02Icon}
                    className="text-destructive/60 group-hover:text-destructive"
                  />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative flex min-h-[160px] flex-col items-center px-3 pb-4 pt-4 text-center">
              <div className="h-[78px] w-[92px] shrink-0">
                {isImage ? (
                  <button
                    type="button"
                    className="relative h-full w-full cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-muted/30"
                    onClick={() => onPreviewImage(file.url!, file.name)}
                  >
                    <Image
                      src={file.url!}
                      alt={file.name}
                      fill
                      sizes="92px"
                      className="object-cover"
                    />
                  </button>
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-xl border border-border/60 bg-muted/30">
                    <FileTypeIcon kind={kind} className="h-10 w-10" />
                  </div>
                )}
              </div>

              <p
                className="mt-3 h-10 w-full max-w-[92px] overflow-hidden text-sm font-medium leading-5 line-clamp-2 break-all text-foreground"
                title={file.name}
              >
                {file.name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
