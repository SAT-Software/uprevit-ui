import type { ImportRow } from "@/utils/product/product-import-review";

export function ProductImportDestination({ row }: { row: ImportRow }) {
  const { destination } = row;
  if (destination.kind === "none") {
    return <span className="text-muted-foreground text-sm">Not assigned</span>;
  }
  return (
    <div className="min-w-0 space-y-0.5">
      <p className="truncate text-sm" title={destination.label}>
        {destination.label}
      </p>
      {destination.departmentLabel && (
        <p className="truncate text-muted-foreground text-xs" title={destination.departmentLabel}>
          {destination.departmentLabel}
        </p>
      )}
    </div>
  );
}
