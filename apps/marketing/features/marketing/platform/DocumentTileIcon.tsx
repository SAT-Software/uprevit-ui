import * as React from "react";
import { cn } from "@uprevit/ui/lib/utils";

export function DocumentTileIcon({
  kind,
  size = "sm",
  className,
}: {
  kind: "pdf" | "xlsx";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const isPdf = kind === "pdf";
  const isLg = size === "lg";
  const isMd = size === "md";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 border border-separator bg-file-frame shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2",
        isLg
          ? "rounded-[11px] rounded-tr-[16px] p-[3.5px]"
          : isMd
            ? "rounded-[10px] rounded-tr-[14px] p-[3px]"
            : "rounded-[7.5px] rounded-tr-[11px] p-[2.5px]",
        className,
      )}
    >
      <span
        className={cn(
          "flex shrink-0 flex-col bg-file-sheet shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-surface-2",
          isLg
            ? "h-[54px] w-[44px] gap-[3.5px] rounded-[7.5px] rounded-tr-[12.5px] px-[7px] py-[8px]"
            : isMd
              ? "h-[48px] w-[38px] gap-[3px] rounded-[7px] rounded-tr-[11px] px-[6px] py-[7px]"
              : "h-[38px] w-[30px] gap-[2.5px] rounded-[5px] rounded-tr-[8.5px] px-[5px] py-[5.5px]",
        )}
      >
        {isPdf ? (
          <>
            <span
              className={cn(
                "w-full shrink-0 bg-destructive-soft dark:bg-destructive/15",
                isLg
                  ? "h-[12px] rounded-[2px]"
                  : isMd
                    ? "h-[11px] rounded-[2px]"
                    : "h-[8.5px] rounded-[1.5px]",
              )}
            />
            <span
              className={cn(
                "w-[86%] shrink-0 rounded-full bg-file-line",
                isLg || isMd ? "mt-px h-[3px]" : "h-[2.5px]",
              )}
            />
            <span
              className={cn(
                "w-[92%] shrink-0 rounded-full bg-file-line",
                isLg || isMd ? "h-[3px]" : "h-[2.5px]",
              )}
            />
            <span
              className={cn(
                "w-[64%] shrink-0 rounded-full bg-file-line",
                isLg || isMd ? "h-[3px]" : "h-[2.5px]",
              )}
            />
          </>
        ) : (
          [true, false, false, false].map((header, row) => (
            <span key={row} className="flex gap-[2px]">
              {[0, 1, 2].map((col) => (
                <span
                  key={col}
                  className={cn(
                    "flex-1 rounded-[1px]",
                    isLg ? "h-[6px]" : isMd ? "h-[5px]" : "h-[4px]",
                    header
                      ? "bg-success/25 dark:bg-success/30"
                      : "bg-file-line",
                  )}
                />
              ))}
            </span>
          ))
        )}
      </span>

      <span
        className={cn(
          "absolute border font-ui font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.14)] dark:text-surface-0",
          isPdf
            ? "border-destructive-strong/20 bg-destructive"
            : "border-success-strong/20 bg-success-foreground dark:bg-success",
          isLg
            ? "-left-[10px] bottom-[8px] rounded-[5px] px-[5.5px] py-[1.5px] text-[9.5px] leading-[12px]"
            : isMd
              ? "-left-[9px] bottom-[7px] rounded-[4.5px] px-[5px] py-[1.5px] text-[9px] leading-[11px]"
              : "-left-[7px] bottom-[5px] rounded-[3.5px] px-[4px] py-[1px] text-[7.5px] leading-[9px]",
        )}
      >
        {isPdf ? ".pdf" : ".xlsx"}
      </span>
    </span>
  );
}
