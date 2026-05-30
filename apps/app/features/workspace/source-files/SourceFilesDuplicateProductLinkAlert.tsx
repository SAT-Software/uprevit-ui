"use client";

import { useGetAllSourceFileFolders } from "@/hooks/source-files/useGetAllSourceFileFolders";
import { SourceFilesFolder } from "@/types/source-files";
import { PiWarningCircleDuotone } from "react-icons/pi";

interface SourceFilesDuplicateProductLinkAlertProps {
  productId: string;
  productName?: string;
  excludeFolderId?: string;
}

function formatFolderList(names: string[]): string {
  if (names.length === 1) {
    return `"${names[0]}"`;
  }
  if (names.length === 2) {
    return `"${names[0]}" and "${names[1]}"`;
  }
  const last = names[names.length - 1];
  const rest = names.slice(0, -1);
  return `${rest.map((name) => `"${name}"`).join(", ")}, and "${last}"`;
}

export function SourceFilesDuplicateProductLinkAlert({
  productId,
  productName,
  excludeFolderId,
}: SourceFilesDuplicateProductLinkAlertProps) {
  const { data, isLoading } = useGetAllSourceFileFolders(productId);

  const existingFolders = ((data?.result ?? []) as SourceFilesFolder[]).filter(
    (folder) => folder._id !== excludeFolderId,
  );

  if (!productId || isLoading || existingFolders.length === 0) {
    return null;
  }

  const folderNames = existingFolders.map((folder) => folder.name);
  const productLabel = productName ? `"${productName}"` : "this product";
  const isSingleFolder = existingFolders.length === 1;

  return (
    <div
      role="alert"
      className="flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20"
    >
      <PiWarningCircleDuotone className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="text-sm text-amber-800 dark:text-amber-300 mb-1">
        {isSingleFolder ? (
          <>
            The source file folder {formatFolderList(folderNames)} is already
            attached to {productLabel}.
          </>
        ) : (
          <>
            The source file folders {formatFolderList(folderNames)} are already
            attached to {productLabel}.
          </>
        )}{" "}
      </p>
      <p className="text-sm text-amber-800 dark:text-amber-300">
        {" "}
        Do you want to attach this folder as well?{" "}
        {isSingleFolder
          ? "Both source file folders will be linked to the same product."
          : "All source file folders will be linked to the same product."}{" "}
      </p>
    </div>
  );
}
