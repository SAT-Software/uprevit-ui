import { Badge } from "@uprevit/ui/components/ui/badge";
import type { ImportRow } from "@/utils/product/product-import-review";

export function ProductImportDestination({ row }: { row: ImportRow }) {
  const { destination } = row;
  if (destination.kind === "none") {
    return <span className="text-muted-foreground text-sm">Not assigned</span>;
  }
  return (
    <div className="min-w-0 space-y-0.5">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="min-w-0 truncate text-sm" title={destination.label}>
          {destination.label}
        </span>
        {destination.kind === "new" && (
          <Badge variant="blue" className="shrink-0">
            New
          </Badge>
        )}
      </div>
      {destination.departmentLabel && (
        <p className="truncate text-muted-foreground text-xs" title={destination.departmentLabel}>
          {destination.departmentLabel}
          {destination.createsDepartment && " · new department"}
        </p>
      )}
    </div>
  );
}
