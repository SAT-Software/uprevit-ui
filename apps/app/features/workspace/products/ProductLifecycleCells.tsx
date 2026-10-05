import Link from "next/link";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import { ProductStatusBadge } from "@/components/common/ProductStatusBadge";
import type {
  ProductActiveWorkflow,
  ProductReleasedVersion,
  ProductStatus,
} from "@/types/product";

const LINK_CLASS_NAME =
  "truncate rounded-sm text-xs text-muted-foreground hover:text-foreground hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ProductStatusCell({
  status,
  activeWorkflow,
}: {
  status?: ProductStatus;
  activeWorkflow?: ProductActiveWorkflow | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <ProductStatusBadge status={status} className="shrink-0" />
      {activeWorkflow ? (
        <Link
          href={`/workflows/${activeWorkflow.id}`}
          className={cn(LINK_CLASS_NAME, "font-mono")}
          title={`Open workflow ${activeWorkflow.numberLabel}`}
          onClick={(event) => event.stopPropagation()}
        >
          {activeWorkflow.numberLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function ProductVersionCell({
  productId,
  version,
  releasedVersion,
}: {
  productId: string;
  version: number;
  releasedVersion?: ProductReleasedVersion | null;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <Badge variant="secondary" className="shrink-0 font-mono text-xs">
        v{version}
      </Badge>
      {releasedVersion && releasedVersion.id !== productId ? (
        <Link
          href={`/products/${releasedVersion.id}/product-information`}
          className={LINK_CLASS_NAME}
          title={`Open released version ${releasedVersion.version}`}
          onClick={(event) => event.stopPropagation()}
        >
          Released v{releasedVersion.version}
        </Link>
      ) : null}
    </div>
  );
}
