import { AuditLogV2Change } from "@/types/audit-log";

const HIDDEN_AUDIT_CHANGE_PATHS = new Set([
  "type",
  "key",
  "url",
  "product_id",
]);

export const hasAuditChangeValue = (value: unknown) => {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.length > 0;
  return true;
};

export const isMeaningfulAuditChange = (change: AuditLogV2Change) => {
  if (HIDDEN_AUDIT_CHANGE_PATHS.has(change.path)) return false;
  return hasAuditChangeValue(change.from) || hasAuditChangeValue(change.to);
};

export const getVisibleAuditChanges = (changes: AuditLogV2Change[]) =>
  changes.filter(isMeaningfulAuditChange);

export const formatAuditChangePath = (path: string) => {
  if (path === "product" || path === "product_id") return "Product";

  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(/[._]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};
