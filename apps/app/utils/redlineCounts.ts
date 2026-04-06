import type { RedlineArrayItem, RedlineStatus } from "@/utils/redlineArray";

export function hasChangedRedlineStatus(
  status?: RedlineStatus | null
): status is "added" | "removed" | "modified" {
  return status === "added" || status === "removed" || status === "modified";
}

export function countChangedRedlineItems<T>(items: Array<RedlineArrayItem<T>>): number {
  return items.reduce(
    (count, item) => count + (hasChangedRedlineStatus(item.status) ? 1 : 0),
    0
  );
}
