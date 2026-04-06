export interface DiffItem {
  path: string;
  status: "added" | "removed" | "modified";
  old_value?: unknown;
  new_value?: unknown;
}

// Fields to skip during comparison (internal/meta fields)
const SKIP_FIELDS = ["_id", "parent_id", "auditLogs"];
const ASSET_FIELD_NAMES = new Set(["image", "tagged_image", "key", "tagged_image_key"]);

/**
 * Check if a value looks like a MongoDB ObjectId string (24 hex characters)
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isObjectIdString(value: unknown): value is string {
  return typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
}

/**
 * Check if a value looks like an ISO date string
 */
function isDateString(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const date = new Date(value);
  return !isNaN(date.getTime()) && value.includes("T");
}

function decodeUriSafe(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function extractUploadsKeyFromText(value: string): string | null {
  const decodedValue = decodeUriSafe(value.trim());
  const normalizedValue = decodedValue.replace(/\\/g, "/");
  const uploadsIndex = normalizedValue.indexOf("uploads/");

  if (uploadsIndex === -1) return null;

  const keyWithSuffix = normalizedValue.slice(uploadsIndex);
  const key = keyWithSuffix.split(/[?#]/, 1)[0]?.trim();

  return key ? key : null;
}

function getLastPathSegment(path: string): string {
  const normalizedPath = path.replace(/\[\d+\]/g, "");
  const segments = normalizedPath.split(".").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}

function normalizeComparableValue(path: string, value: unknown): unknown {
  const fieldName = getLastPathSegment(path);
  if (!ASSET_FIELD_NAMES.has(fieldName)) return value;
  if (value == null) return null;
  if (typeof value !== "string") return value;

  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  return extractUploadsKeyFromText(trimmedValue) ?? trimmedValue;
}

/**
 * Deep diff comparison between two objects (base version and next version)
 * Returns an array of differences with paths, status, and values
 */
export function deepDiff(
  base: unknown,
  next: unknown,
  path: string = ""
): DiffItem[] {
  const diffs: DiffItem[] = [];
  const normalizedBase = normalizeComparableValue(path, base);
  const normalizedNext = normalizeComparableValue(path, next);

  // Both null/undefined - no diff
  if (normalizedBase == null && normalizedNext == null) return diffs;

  // Added (base doesn't exist, next does)
  if (normalizedBase == null && normalizedNext != null) {
    diffs.push({
      path,
      status: "added",
      old_value: null,
      new_value: sanitizeValue(normalizedNext),
    });
    return diffs;
  }

  // Removed (base exists, next doesn't)
  if (normalizedBase != null && normalizedNext == null) {
    diffs.push({
      path,
      status: "removed",
      old_value: sanitizeValue(normalizedBase),
      new_value: null,
    });
    return diffs;
  }

  // Handle ObjectId string comparison (24 hex character strings)
  if (isObjectIdString(normalizedBase) || isObjectIdString(normalizedNext)) {
    const baseStr = String(normalizedBase);
    const nextStr = String(normalizedNext);
    if (baseStr !== nextStr) {
      diffs.push({
        path,
        status: "modified",
        old_value: baseStr,
        new_value: nextStr,
      });
    }
    return diffs;
  }

  // Handle Date string comparison
  if (isDateString(normalizedBase) || isDateString(normalizedNext)) {
    const baseTime = isDateString(normalizedBase)
      ? new Date(normalizedBase).getTime()
      : null;
    const nextTime = isDateString(normalizedNext)
      ? new Date(normalizedNext).getTime()
      : null;
    if (baseTime !== nextTime) {
      diffs.push({
        path,
        status: "modified",
        old_value: normalizedBase,
        new_value: normalizedNext,
      });
    }
    return diffs;
  }

  // Different types
  if (typeof normalizedBase !== typeof normalizedNext) {
    diffs.push({
      path,
      status: "modified",
      old_value: sanitizeValue(normalizedBase),
      new_value: sanitizeValue(normalizedNext),
    });
    return diffs;
  }

  // Primitives (string, number, boolean)
  if (typeof normalizedBase !== "object") {
    if (normalizedBase !== normalizedNext) {
      diffs.push({
        path,
        status: "modified",
        old_value: normalizedBase,
        new_value: normalizedNext,
      });
    }
    return diffs;
  }

  // Arrays - compare with parent_id-based matching when items have parent_id fields
  if (Array.isArray(normalizedBase) || Array.isArray(normalizedNext)) {
    const baseArr = Array.isArray(normalizedBase) ? normalizedBase : [];
    const nextArr = Array.isArray(normalizedNext) ? normalizedNext : [];

    // Check if array items are objects (could have _id/parent_id)
    const hasObjectItems = (arr: unknown[]) =>
      arr.length === 0 || isRecord(arr[0]);

    // Check if items have parent_id (for version tracking) - check both arrays
    const hasParentIds = (baseItems: unknown[], nextItems: unknown[]) => {
      // If next array items have parent_id, use parent_id matching
      const nextHasParentId = nextItems.some(
        (item) => isRecord(item) && Boolean(item.parent_id)
      );
      // If base array items have _id, they could be matched
      const baseHasIds = baseItems.some(
        (item) => isRecord(item) && Boolean(item._id)
      );
      return nextHasParentId && baseHasIds;
    };

    if (
      hasObjectItems(baseArr) &&
      hasObjectItems(nextArr) &&
      hasParentIds(baseArr, nextArr)
    ) {
      // Use parent_id-based matching (for arrays like symbols_graphics with _id)

      // Get the _id from an item (base version items use _id)
      const getBaseId = (item: unknown): string => {
        if (!isRecord(item)) return "";
        return item._id ? String(item._id) : "";
      };

      const baseMap = new Map<
        string,
        { item: Record<string, unknown>; index: number }
      >();
      baseArr.forEach((item, index) => {
        const id = getBaseId(item);
        if (id && isRecord(item)) baseMap.set(id, { item, index });
      });

      // Track which base items have been matched
      const matchedBaseIds = new Set<string>();

      // Process NEXT items - find their parent in BASE using parent_id
      nextArr.forEach((nextItem, nextIndex) => {
        const parentId =
          isRecord(nextItem) && nextItem.parent_id
            ? String(nextItem.parent_id)
            : "";

        if (parentId && baseMap.has(parentId)) {
          // Found matching base item - compare for modifications
          const baseEntry = baseMap.get(parentId)!;
          matchedBaseIds.add(parentId);

          const itemPath = path ? `${path}[${nextIndex}]` : `[${nextIndex}]`;
          diffs.push(...deepDiff(baseEntry.item, nextItem, itemPath));
        } else if (nextItem != null) {
          // No parent_id OR parent_id doesn't match any base item = NEW item
          const itemPath = path ? `${path}[${nextIndex}]` : `[${nextIndex}]`;
          diffs.push({
            path: itemPath,
            status: "added",
            old_value: null,
            new_value: sanitizeValue(nextItem),
          });
        }
      });

      // Find REMOVED items (base items that weren't matched by any next item's parent_id)
      for (const [baseId, { item, index }] of baseMap) {
        if (!matchedBaseIds.has(baseId)) {
          const itemPath = path ? `${path}[${index}]` : `[${index}]`;
          diffs.push({
            path: itemPath,
            status: "removed",
            old_value: sanitizeValue(item),
            new_value: null,
          });
        }
      }
    } else {
      // Fallback: index-based comparison for arrays without parent_id (like custom_fields)
      // or arrays of primitives (strings, numbers)
      const maxLen = Math.max(baseArr.length, nextArr.length);
      for (let i = 0; i < maxLen; i++) {
        const itemPath = path ? `${path}[${i}]` : `[${i}]`;
        diffs.push(...deepDiff(baseArr[i], nextArr[i], itemPath));
      }
    }
    return diffs;
  }

  // Objects - recurse into each key
  const baseObj = isRecord(normalizedBase) ? normalizedBase : {};
  const nextObj = isRecord(normalizedNext) ? normalizedNext : {};
  const allKeys = new Set([...Object.keys(baseObj), ...Object.keys(nextObj)]);

  for (const key of allKeys) {
    // Skip internal fields we don't want to compare
    if (SKIP_FIELDS.includes(key)) continue;

    const newPath = path ? `${path}.${key}` : key;
    diffs.push(...deepDiff(baseObj[key], nextObj[key], newPath));
  }

  return diffs;
}

/**
 * Sanitize value for comparison (ensure consistent types)
 */
function sanitizeValue(value: unknown): unknown {
  if (value == null) return null;
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (isRecord(value)) {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
      result[key] = sanitizeValue(value[key]);
    }
    return result;
  }
  return value;
}
