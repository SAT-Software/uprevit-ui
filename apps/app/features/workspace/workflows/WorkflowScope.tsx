import { Blockchain03Icon, PackageIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { cn } from "@uprevit/ui/lib/utils";
import type {
  WorkflowDiscussionScope,
  WorkflowProduct,
} from "@/types/workflow";

const PACKAGE_VALUE = "package";

export const getScopeLabel = (
  scope: WorkflowDiscussionScope,
  products: WorkflowProduct[],
) =>
  scope.type === "package"
    ? "Whole package"
    : (products.find((product) => product.lineageId === scope.lineageId)
        ?.name ?? "Removed Product");

export function WorkflowScopeSelect({
  id,
  products,
  value,
  disabled,
  size,
  className,
  onValueChange,
}: {
  id?: string;
  products: WorkflowProduct[];
  value: WorkflowDiscussionScope;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  onValueChange: (scope: WorkflowDiscussionScope) => void;
}) {
  return (
    <Select
      value={value.type === "package" ? PACKAGE_VALUE : value.lineageId}
      disabled={disabled}
      onValueChange={(next) =>
        onValueChange(
          next === PACKAGE_VALUE
            ? { type: "package" }
            : { type: "product", lineageId: next },
        )
      }
    >
      <SelectTrigger
        id={id}
        size={size}
        aria-label="Scope"
        className={cn("bg-background", className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={PACKAGE_VALUE}>
          <Icon icon={PackageIcon} size={14} />
          Whole package
        </SelectItem>
        {products.map((product) => (
          <SelectItem key={product.lineageId} value={product.lineageId}>
            <Icon icon={Blockchain03Icon} size={14} />
            {product.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function WorkflowScopeChip({
  scope,
  products,
}: {
  scope: WorkflowDiscussionScope;
  products: WorkflowProduct[];
}) {
  const label = getScopeLabel(scope, products);

  return (
    <span
      className="inline-flex max-w-48 items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
      title={label}
    >
      <Icon
        icon={scope.type === "package" ? PackageIcon : Blockchain03Icon}
        size={12}
        className="shrink-0"
      />
      <span className="truncate">{label}</span>
    </span>
  );
}
