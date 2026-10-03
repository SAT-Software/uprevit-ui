import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";

export function AuditMetaCell({
  name,
  date,
}: {
  name?: string | null;
  date?: string | null;
}) {
  const formattedDate = formatToLocalDateTime(date);

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="truncate text-sm font-medium">{name || "—"}</span>
      {formattedDate ? (
        <span className="truncate text-xs text-muted-foreground/60">
          {formattedDate}
        </span>
      ) : null}
    </div>
  );
}
