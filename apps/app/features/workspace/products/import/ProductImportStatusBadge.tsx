import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  FolderAddIcon,
  MinusSignCircleIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import type { ImportRow } from "@/utils/product/product-import-review";

const errorCount = (row: ImportRow) => row.issues.filter((issue) => issue.level === "error").length;

export function ProductImportStatusBadge({ row }: { row: ImportRow }) {
  if (row.status === "excluded") {
    return (
      <Badge variant="gray">
        <Icon icon={MinusSignCircleIcon} size={12} />
        Left out
      </Badge>
    );
  }
  if (row.status === "error") {
    const count = errorCount(row);
    return (
      <Badge variant="red">
        <Icon icon={AlertCircleIcon} size={12} />
        {count === 1 ? "1 error" : `${count} errors`}
      </Badge>
    );
  }
  if (row.status === "needs-project") {
    return (
      <Badge variant="yellow">
        <Icon icon={FolderAddIcon} size={12} />
        Needs project
      </Badge>
    );
  }
  return (
    <Badge variant="green">
      <Icon icon={CheckmarkCircle02Icon} size={12} />
      Ready
    </Badge>
  );
}
