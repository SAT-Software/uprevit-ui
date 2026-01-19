"use client";

import {
  PiFileArchiveDuotone,
  PiFileDuotone,
  PiFileTextDuotone,
  PiHeadphonesDuotone,
  PiImageDuotone,
  PiTableDuotone,
  PiUploadSimpleDuotone,
  PiVideoDuotone,
  PiWarningCircleDuotone,
  PiXDuotone,
} from "react-icons/pi";

import { formatBytes, useFileUpload } from "@/hooks/general/use-file-upload";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

// Create some dummy initial files
// const initialFiles = [
//   {
//     name: "document.pdf",
//     size: 528737,
//     type: "application/pdf",
//     url: "https://example.com/document.pdf",
//     id: "document.pdf-1744638436563-8u5xuls",
//   },
//   {
//     name: "intro.zip",
//     size: 252873,
//     type: "application/zip",
//     url: "https://example.com/intro.zip",
//     id: "intro.zip-1744638436563-8u5xuls",
//   },
//   {
//     name: "conclusion.xlsx",
//     size: 352873,
//     type: "application/xlsx",
//     url: "https://example.com/conclusion.xlsx",
//     id: "conclusion.xlsx-1744638436563-8u5xuls",
//   },
// ]

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
    return <PiFileTextDuotone className="size-4 opacity-60" />;
  } else if (
    fileType.includes("zip") ||
    fileType.includes("archive") ||
    fileName.endsWith(".zip") ||
    fileName.endsWith(".rar")
  ) {
    return <PiFileArchiveDuotone className="size-4 opacity-60" />;
  } else if (
    fileType.includes("excel") ||
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx")
  ) {
    return <PiTableDuotone className="size-4 opacity-60" />;
  } else if (fileType.includes("video/")) {
    return <PiVideoDuotone className="size-4 opacity-60" />;
  } else if (fileType.includes("audio/")) {
    return <PiHeadphonesDuotone className="size-4 opacity-60" />;
  } else if (fileType.startsWith("image/")) {
    return <PiImageDuotone className="size-4 opacity-60" />;
  }
  return <PiFileDuotone className="size-4 opacity-60" />;
};

type UploadSourceFilesProps = {
  onSelectionChange?: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // bytes
};

export default function Component({
  onSelectionChange,
  accept,
  maxFiles: maxFilesProp,
  maxSize: maxSizeProp,
}: UploadSourceFilesProps) {
  // Match server route constraints by default: all files, max 4 files, 4MB
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
    // initialFiles,
  });

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
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
            <PiUploadSimpleDuotone className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Upload files</p>
          <p className="text-muted-foreground mb-2 text-xs">
            Drag & drop or click to browse
          </p>
          <div className="text-muted-foreground/70 flex flex-wrap justify-center gap-1 text-xs">
            <span>All files</span>
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
          <PiWarningCircleDuotone className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* Upload status and actions are handled by parent */}

      {/* File list */}
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
                <PiXDuotone className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ))}

          {/* Remove file / reset */}
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
