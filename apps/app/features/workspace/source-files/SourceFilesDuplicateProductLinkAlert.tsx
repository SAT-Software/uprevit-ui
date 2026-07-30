"use client";

import { Alert01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@uprevit/ui/components/common/Icon";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { useGetProductLinkedSourceFileFolders } from "@/hooks/source-files/useGetProductLinkedSourceFileFolders";

interface SourceFilesDuplicateProductLinkAlertProps {
  productId: string;
  productName?: string;
  excludeFolderId?: string;
  enabled?: boolean;
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
  enabled = true,
}: SourceFilesDuplicateProductLinkAlertProps) {
  const { folders, isLoading } = useGetProductLinkedSourceFileFolders(
    productId,
    enabled,
  );

  const existingFolders = folders.filter(
    (folder) => folder._id !== excludeFolderId,
  );

  if (!productId || !enabled) {
    return null;
  }

  if (isLoading) {
    return (
      <div
        aria-hidden="true"
        className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground"
      >
        <Spinner className="size-4 shrink-0" />
        Checking existing product links...
      </div>
    );
  }

  if (existingFolders.length === 0) {
    return null;
  }

  const folderNames = existingFolders.map((folder) => folder.name);
  const productLabel = productName ? `"${productName}"` : "this product";
  const isSingleFolder = existingFolders.length === 1;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20"
    >
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        aria-hidden="true"
      >
        <Icon icon={Alert01Icon} size={16} strokeWidth={2} />
      </div>
      <div className="space-y-1 text-sm text-amber-800 dark:text-amber-300">
        <p>
          {isSingleFolder ? (
            <>
              The source file folder {formatFolderList(folderNames)} is already
              attached to {productLabel}.
            </>
          ) : (
            <>
              The source file folders {formatFolderList(folderNames)} are
              already attached to {productLabel}.
            </>
          )}
        </p>
        <p>
          Do you want to attach this folder as well?{" "}
          {isSingleFolder
            ? "Both source file folders will be linked to the same product."
            : "All the existing  and current source file folders will be linked to the same product."}
        </p>
      </div>
    </div>
  );
}
