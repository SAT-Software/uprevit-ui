"use client";

import {
  Alert01Icon,
  Cancel01Icon,
  Doc01Icon,
  File02Icon,
  FileZipIcon,
  HeadphonesIcon,
  Image01Icon,
  UploadSquare01Icon,
  Video01Icon,
  Xls01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";

import { formatBytes, useFileUpload } from "@/hooks/general/use-file-upload";
import { Button } from "@uprevit/ui/components/ui/button";
import { useMemo } from "react";

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  if (
    fileType.includes("pdf") ||
    fileName.endsWith(".pdf") ||
    fileType.includes("word") ||
    fileName.endsWith(".doc") ||
    fileName.endsWith(".docx")
  ) {
    return (
      <Icon icon={Doc01Icon} size={16} strokeWidth={2} className="opacity-60" />
    );
  }
  if (
    fileType.includes("zip") ||
    fileType.includes("archive") ||
    fileName.endsWith(".zip") ||
    fileName.endsWith(".rar")
  ) {
    return (
      <Icon
        icon={FileZipIcon}
        size={16}
        strokeWidth={2}
        className="opacity-60"
      />
    );
  }
  if (
    fileType.includes("excel") ||
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx")
  ) {
    return (
      <Icon icon={Xls01Icon} size={16} strokeWidth={2} className="opacity-60" />
    );
  }
  if (fileType.includes("video/")) {
    return (
      <Icon icon={Video01Icon} size={16} strokeWidth={2} className="opacity-60" />
    );
  }
  if (fileType.includes("audio/")) {
    return (
      <Icon
        icon={HeadphonesIcon}
        size={16}
        strokeWidth={2}
        className="opacity-60"
      />
    );
  }
  if (fileType.startsWith("image/")) {
    return (
      <Icon icon={Image01Icon} size={16} strokeWidth={2} className="opacity-60" />
    );
  }
  return (
    <Icon icon={File02Icon} size={16} strokeWidth={2} className="opacity-60" />
  );
};

type UploadSourceFilesProps = {
  onSelectionChange?: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
};

export default function Component({
  onSelectionChange,
  accept,
  maxFiles: maxFilesProp,
  maxSize: maxSizeProp,
}: UploadSourceFilesProps) {
  const maxFiles = useMemo(() => maxFilesProp ?? 4, [maxFilesProp]);
  const maxSize = useMemo(() => maxSizeProp ?? 4 * 1024 * 1024, [maxSizeProp]);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: maxFiles > 1,
    maxFiles,
    maxSize,
    accept: accept ?? "*",
    onFilesChange: (list) => {
      const onlyFiles = list
        .map((f) => f.file)
        .filter((f): f is File => f instanceof File);
      onSelectionChange?.(onlyFiles);
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div
        role="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload files"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <Icon
              icon={UploadSquare01Icon}
              size={16}
              strokeWidth={2}
              className="opacity-60"
            />
          </div>
          <p className="mb-1.5 text-sm font-medium">Upload files</p>
          <p className="text-muted-foreground mb-2 text-xs">
            Drag & drop or click to browse
          </p>
          <div className="text-muted-foreground/70 flex flex-wrap justify-center gap-1 text-xs">
            <span>Supported files only</span>
            <span>∙</span>
            <span>Max {maxFiles} files</span>
            <span>∙</span>
            <span>Up to {formatBytes(maxSize)}</span>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <Icon icon={Alert01Icon} size={12} strokeWidth={2} className="shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                  {getFileIcon(file)}
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-[13px] font-medium">
                    {file.file instanceof File
                      ? file.file.name
                      : file.file.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatBytes(
                      file.file instanceof File
                        ? file.file.size
                        : file.file.size,
                    )}
                  </p>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                onClick={() => removeFile(file.id)}
                aria-label="Remove file"
              >
                <Icon
                  icon={Cancel01Icon}
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
            </div>
          ))}

          {files.length >= 1 && (
            <div>
              <Button size="sm" variant="outline" onClick={clearFiles}>
                Remove file
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
