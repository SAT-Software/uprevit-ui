import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import type { ProductStatus } from "@/types/product";
import { PRODUCT_STATUS_LABELS } from "@/utils/product/product-lifecycle";

const STATUS_STYLES: Record<
  ProductStatus,
  { variant: "gray" | "blue" | "yellow" | "green" | "secondary"; dot: string }
> = {
  draft: { variant: "gray", dot: "bg-gray-500 dark:bg-gray-400" },
  submitted: { variant: "blue", dot: "bg-blue-500 dark:bg-blue-400" },
  in_review: { variant: "yellow", dot: "bg-amber-500 dark:bg-amber-400" },
  released: { variant: "green", dot: "bg-green-500 dark:bg-green-400" },
  obsolete: { variant: "secondary", dot: "bg-muted-foreground/50" },
};

export function ProductStatusBadge({
  status,
  className,
}: {
  status?: ProductStatus;
  className?: string;
}) {
  const style = status && STATUS_STYLES[status];
  if (!style) return null;

  return (
    <Badge variant={style.variant} className={cn("font-normal", className)}>
      <span className={cn("size-2 rounded-full", style.dot)} />
      {PRODUCT_STATUS_LABELS[status]}
    </Badge>
  );
}
