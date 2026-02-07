import { deepDiff, DiffItem } from "@/utils/deepDiff";

export type RedlineStatus = "added" | "removed" | "modified" | "unchanged";

export type RedlineArrayItem<T> = {
  id: string;
  base: T | null;
  next: T | null;
  status: RedlineStatus;
  diffs: DiffItem[];
};

type RedlineArrayOptions<T> = {
  getId?: (item: T) => string | undefined;
  getParentId?: (item: T) => string | undefined;
  getFallbackKey?: (item: T) => string | undefined;
};

type Entry<T> = { item: T; index: number };

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const defaultGetId = <T>(item: T): string | undefined => {
  if (!isRecord(item)) return undefined;
  const candidate = item._id;
  if (candidate === null) return undefined;
  return String(candidate);
};

const defaultGetParentId = <T>(item: T): string | undefined => {
  if (!isRecord(item)) return undefined;
  const candidate = item.parent_id;
  if (candidate === null) return undefined;
  return String(candidate);
};

export function buildRedlineArray<T>(
  baseItems: T[] = [],
  nextItems: T[] = [],
  options: RedlineArrayOptions<T> = {},
): RedlineArrayItem<T>[] {
  const getId = options.getId ?? defaultGetId;
  const getParentId = options.getParentId ?? defaultGetParentId;
  const getFallbackKey = options.getFallbackKey;

  const baseById = new Map<string, Entry<T>>();
  const baseByFallback = new Map<string, Entry<T>>();
  const usedBaseIndices = new Set<number>();

  baseItems.forEach((item, index) => {
    const id = getId(item);
    if (id) baseById.set(id, { item, index });
    const fallbackKey = getFallbackKey?.(item);
    if (fallbackKey) baseByFallback.set(fallbackKey, { item, index });
  });

  const pickEntry = (map: Map<string, Entry<T>>, key?: string | null) => {
    if (!key) return undefined;
    const entry = map.get(key);
    if (!entry || usedBaseIndices.has(entry.index)) return undefined;
    return entry;
  };

  const results: RedlineArrayItem<T>[] = [];

  nextItems.forEach((nextItem, nextIndex) => {
    const parentId = getParentId(nextItem);
    const nextId = getId(nextItem);
    const fallbackKey = getFallbackKey?.(nextItem);

    const baseEntry =
      pickEntry(baseById, parentId) ||
      pickEntry(baseById, nextId) ||
      pickEntry(baseByFallback, fallbackKey);

    const baseItem = baseEntry?.item ?? null;
    if (baseEntry) usedBaseIndices.add(baseEntry.index);

    const diffs = baseItem ? deepDiff(baseItem, nextItem) : [];
    const status: RedlineStatus = baseItem
      ? diffs.length > 0
        ? "modified"
        : "unchanged"
      : "added";

    results.push({
      id: nextId || parentId || fallbackKey || `next-${nextIndex}`,
      base: baseItem,
      next: nextItem,
      status,
      diffs,
    });
  });

  baseItems.forEach((baseItem, baseIndex) => {
    if (usedBaseIndices.has(baseIndex)) return;
    const baseId = getId(baseItem);
    const fallbackKey = getFallbackKey?.(baseItem);
    results.push({
      id: baseId || fallbackKey || `base-${baseIndex}`,
      base: baseItem,
      next: null,
      status: "removed",
      diffs: [],
    });
  });

  return results;
}
