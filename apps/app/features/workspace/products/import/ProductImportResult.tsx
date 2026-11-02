"use client";

import Link from "next/link";
import { AlertCircleIcon, CheckmarkCircle02Icon, RefreshIcon, Upload04Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Progress } from "@uprevit/ui/components/ui/progress";
import type { ImportCreateResult } from "@/types/product-import";

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

export function ProductImportProgress({ done, total }: { done: number; total: number }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 p-4 md:py-16" role="status">
      <p className="text-sm font-medium tabular-nums">
        Creating draft products… {done} of {total}
      </p>
      <Progress value={total ? (done / total) * 100 : 0} aria-label="Import progress" />
      <p className="text-muted-foreground text-xs text-pretty">Keep this page open until the import finishes.</p>
    </div>
  );
}

interface ProductImportResultProps {
  results: ImportCreateResult[];
  createdProjects: number;
  createdDepartments: number;
  onRetry: () => void;
  onImportAnother: () => void;
}

export function ProductImportResult({ results, createdProjects, createdDepartments, onRetry, onImportAnother }: ProductImportResultProps) {
  const created = results.filter((result) => result.status === "created").length;
  const failed = results.filter((result) => result.status === "failed");
  const extras = [
    createdProjects ? plural(createdProjects, "project") : "",
    createdDepartments ? plural(createdDepartments, "department") : "",
  ].filter(Boolean);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 md:py-10">
      <div className="flex gap-3">
        <div className={failed.length && !created ? "text-destructive" : "text-emerald-600 dark:text-emerald-500"}>
          <Icon icon={failed.length && !created ? AlertCircleIcon : CheckmarkCircle02Icon} size={24} />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-balance">
            {created ? `${plural(created, "draft product")} created` : "No products were created"}
          </h2>
          <p className="text-muted-foreground text-sm text-pretty">
            {extras.length ? `The import also created ${extras.join(" and ")}. ` : ""}
            {failed.length
              ? `${plural(failed.length, "product")} couldn't be created. They're listed below.`
              : "Every ready product was created as a Draft."}
          </p>
        </div>
      </div>

      {failed.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border">
          <p className="border-b border-border bg-muted/60 px-3 py-2 text-sm font-medium">Not created</p>
          <ul className="max-h-80 divide-y divide-border overflow-y-auto">
            {failed.map((result, index) => (
              <li key={`${result.plan_number}-${index}`} className="flex flex-col gap-0.5 px-3 py-2 sm:flex-row sm:gap-3">
                <span className="shrink-0 text-sm font-medium tabular-nums sm:w-40 sm:truncate" title={result.plan_number}>
                  {result.plan_number}
                </span>
                <span className="text-muted-foreground text-sm text-pretty">{result.error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {created > 0 && (
          <Button asChild size="sm">
            <Link href="/products">View products</Link>
          </Button>
        )}
        {failed.length > 0 && (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            <Icon icon={RefreshIcon} />
            Try again for {plural(failed.length, "product")}
          </Button>
        )}
        <Button type="button" variant={created ? "outline" : "default"} size="sm" onClick={onImportAnother}>
          <Icon icon={Upload04Icon} />
          Import another file
        </Button>
      </div>
    </div>
  );
}
