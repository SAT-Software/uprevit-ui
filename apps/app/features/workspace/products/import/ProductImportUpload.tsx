"use client";

import { Download04Icon, Upload04Icon, Xls02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { cn } from "@uprevit/ui/lib/utils";
import { ErrorState } from "@/components/common/ErrorState";
import { useFileUpload } from "@/hooks/general/use-file-upload";
import { MAX_IMPORT_FILE_BYTES, MAX_IMPORT_FILE_MB, MAX_IMPORT_PRODUCTS } from "@/utils/product/product-import-workbook";

export const IMPORT_TEMPLATE_URL = "/templates/Uprevit-Import-Template-v1.xlsx";
export const IMPORT_EXAMPLE_URL = "/templates/Uprevit-Import-Example-v1.xlsx";

const STEPS = [
  { title: "Fill in the template", text: "One row per product on Products, All Standards, Languages and Label Components." },
  { title: "Upload and review", text: "Check every product, fix problems in the file and assign projects." },
  { title: "Create drafts", text: "Ready products become Draft products. Nothing is approved or released." },
];

interface ProductImportUploadProps {
  busyLabel: string | null;
  error: string | null;
  onFile: (file: File) => void;
}

export function ProductImportUpload({ busyLabel, error, onFile }: ProductImportUploadProps) {
  const [{ isDragging, errors }, { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: ".xlsx,.xlsm,.xls",
      maxSize: MAX_IMPORT_FILE_BYTES,
      onFilesAdded: (files) => {
        const file = files[0]?.file;
        if (file instanceof File) onFile(file);
      },
    });
  const message = error ?? errors[0] ?? null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:py-10">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-balance">Import products from the Uprevit template</h2>
        <p className="text-muted-foreground text-sm text-pretty">
          Create many Draft products at once. Departments and projects named in the file are created if they don&apos;t exist yet.
        </p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-3 rounded-xl border border-border p-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium tabular-nums">
              {index + 1}
            </span>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{step.title}</p>
              <p className="text-muted-foreground text-xs text-pretty">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className={cn(
          "flex min-h-56 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-input p-6 text-center transition-colors",
          "data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/5",
        )}
      >
        <input {...getInputProps({ disabled: !!busyLabel })} tabIndex={-1} className="sr-only" aria-hidden="true" />
        {busyLabel ? (
          <div role="status" className="flex flex-col items-center gap-3">
            <Spinner className="size-6" />
            <p className="text-sm font-medium">{busyLabel}</p>
          </div>
        ) : (
          <>
            <div className="flex size-11 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
              <Icon icon={Xls02Icon} size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Drop your filled template here</p>
              <p className="text-muted-foreground text-xs">Excel workbook (.xlsx), up to {MAX_IMPORT_FILE_MB} MB and {MAX_IMPORT_PRODUCTS.toLocaleString("en-US")} products</p>
            </div>
            <Button type="button" size="sm" onClick={openFileDialog}>
              <Icon icon={Upload04Icon} />
              Choose file
            </Button>
          </>
        )}
      </div>

      {message && (
        <ErrorState
          icon={Xls02Icon}
          title="This file can't be imported"
          description={message}
        />
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Don&apos;t have the template yet?</p>
          <p className="text-muted-foreground text-xs text-pretty">
            The template explains every column on its Instructions sheet. The example has five filled-in products.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={IMPORT_EXAMPLE_URL} download>
              <Icon icon={Download04Icon} />
              Example
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={IMPORT_TEMPLATE_URL} download>
              <Icon icon={Download04Icon} />
              Template
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
