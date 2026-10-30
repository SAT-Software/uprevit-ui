"use client";

import { useState } from "react";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import type { WorkbookConditionalRule } from "@/types/product-data-table";
import { workbookNumber } from "@/utils/product/workbook-cell-utils";
import {
  NO_FILL_COLOR,
  isDefaultWorkbookTextColor,
} from "@/utils/product/workbook-cell-colors";
import { Button } from "@uprevit/ui/components/ui/button";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import {
  Dialog,
  DialogTrigger,
} from "@uprevit/ui/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { PaintBucketIcon, TextSquareIcon } from "@hugeicons/core-free-icons";
import { WorkbookColorPopover } from "./WorkbookColorPopover";

const OPERATORS = {
  gt: "Greater than",
  lt: "Less than",
  eq: "Equal to",
  contains: "Text contains",
} as const;

function describePositions(positions: number[]) {
  const ranges: string[] = [];
  for (let index = 0; index < positions.length; index++) {
    const start = positions[index];
    while (positions[index + 1] === positions[index] + 1) index++;
    const end = positions[index];
    ranges.push(start === end ? String(start) : `${start}–${end}`);
  }
  return ranges.join(", ");
}

export function WorkbookConditionalFormatDialog({
  rules,
  scope,
  rowOrder,
  columnOrder,
  fillColors,
  textColors,
  disabled,
  onChange,
}: {
  rules: WorkbookConditionalRule[];
  scope: { rows: number[]; columns: number[] } | null;
  rowOrder: number[];
  columnOrder: string[];
  fillColors: readonly string[];
  textColors: readonly string[];
  disabled: boolean;
  onChange: (rules: WorkbookConditionalRule[]) => void;
}) {
  const [draft, setDraft] = useState<WorkbookConditionalRule | null>(null);
  const describe = (rule: { rows: number[]; columns: number[] }) => {
    const rows = rule.rows
      .map((row) => rowOrder.indexOf(row) + 3)
      .sort((a, b) => a - b);
    const columns = rule.columns
      .map((col) => columnOrder.indexOf(`col-${col}`) + 1)
      .sort((a, b) => a - b);
    const cells = rows.length * columns.length;
    return `Rows ${describePositions(rows)}; columns ${describePositions(columns)} (${cells} ${cells === 1 ? "cell" : "cells"})`;
  };
  const valid =
    draft &&
    draft.value.trim() !== "" &&
    (draft.bgColor || draft.textColor) &&
    (draft.operator === "contains" ||
      workbookNumber(draft.value) !== undefined);
  const numberError =
    !!draft &&
    draft.operator !== "contains" &&
    draft.value !== "" &&
    workbookNumber(draft.value) === undefined;
  const existing = rules.some((rule) => rule.id === draft?.id);
  return (
    <Dialog onOpenChange={() => setDraft(null)}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" title="Conditional formatting">
          Rules{rules.length ? ` (${rules.length})` : ""}
        </Button>
      </DialogTrigger>
      <AppDialogContent title="Conditional formatting" description="Manage rules that color cells when conditions match." size="md" secondaryAction={{ label: "Done" }}>
        <div className="space-y-4 p-4">
        <p className="text-sm text-muted-foreground">Color cells when a condition matches. Later rules take priority.</p>
        <div className="max-h-60 space-y-2 overflow-y-auto">
          {!rules.length && (
            <p className="text-sm text-muted-foreground">No rules yet. Select cells to add your first condition.</p>
          )}
          {rules.map((rule, index) => (
            <div
              key={rule.id}
              className="flex flex-wrap items-center gap-2 rounded-md border p-3 text-xs"
            >
              <span
                className="size-5 shrink-0 rounded border"
                style={{ backgroundColor: rule.bgColor, color: rule.textColor }}
              >
                A
              </span>
              <div className="min-w-32 flex-1">
                <p className="break-words">
                  {index + 1}. {OPERATORS[rule.operator]} “{rule.value}”
                </p>
                <p className="text-muted-foreground break-words">
                  {describe(rule)}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                disabled={disabled}
                aria-label={`Edit rule ${index + 1}`}
                onClick={() => setDraft({ ...rule })}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={disabled}
                aria-label={`Remove rule ${index + 1}`}
                onClick={() => {
                  onChange(rules.filter((item) => item.id !== rule.id));
                  if (draft?.id === rule.id) setDraft(null);
                }}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          disabled={disabled || !scope}
          onClick={() =>
            scope &&
            setDraft({
              id: crypto.randomUUID(),
              ...scope,
              operator: "gt",
              value: "",
              bgColor: "#fef08a",
            })
          }
        >
          New rule for selection
        </Button>
        {!scope && (
          <p className="text-xs text-muted-foreground">
            Select a rectangular range to create a rule.
          </p>
        )}
        {draft && !disabled && (
          <div className="space-y-3 rounded-md border p-3">
            <p className="text-xs">{describe(draft)}</p>
            {existing && (
              <Button
                size="sm"
                variant="outline"
                disabled={disabled || !scope}
                onClick={() => scope && setDraft({ ...draft, ...scope })}
              >
                Use current selection as range
              </Button>
            )}
            <div className="grid gap-3 sm:grid-cols-2"><div className="space-y-1.5">
              <Label htmlFor="workbook-rule-operator">Condition</Label>
              <Select
                value={draft.operator}
                onValueChange={(value) =>
                  setDraft({
                    ...draft,
                    operator: value as WorkbookConditionalRule["operator"],
                  })
                }
              >
                <SelectTrigger id="workbook-rule-operator">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(OPERATORS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="workbook-rule-value">
                {draft.operator === "contains"
                  ? "Text (case insensitive)"
                  : "Number"}
              </Label>
              <Input
                id="workbook-rule-value"
                value={draft.value}
                aria-invalid={numberError}
                aria-describedby={numberError ? "workbook-rule-value-error" : undefined}
                onChange={(event) =>
                  setDraft({ ...draft, value: event.target.value })
                }
              />
              {numberError && (
                <p id="workbook-rule-value-error" className="text-xs text-destructive">
                  Enter a plain number, such as 12 or -0.5.
                </p>
              )}
            </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t pt-3">
              <span className="text-xs">Colors</span>
              <WorkbookColorPopover
                icon={PaintBucketIcon}
                label="Rule fill color"
                colors={fillColors}
                currentColor={draft.bgColor}
                isMixed={false}
                variant="fill"
                onSelect={(color) =>
                  setDraft({
                    ...draft,
                    bgColor: color === NO_FILL_COLOR ? undefined : color,
                  })
                }
              />
              <WorkbookColorPopover
                icon={TextSquareIcon}
                label="Rule text color"
                colors={textColors}
                currentColor={draft.textColor}
                isMixed={false}
                variant="text"
                onSelect={(color) =>
                  setDraft({
                    ...draft,
                    textColor: isDefaultWorkbookTextColor(color)
                      ? undefined
                      : color,
                  })
                }
              />
              <span
                className="rounded border px-3 py-1 text-sm"
                style={{
                  backgroundColor: draft.bgColor,
                  color: draft.textColor,
                }}
              >
                Preview
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose at least one color. Numeric rules apply to plain numbers
              only.
            </p>
            <div className="flex flex-wrap justify-end gap-2 border-t pt-3">
              <Button
                size="sm"
                disabled={!valid}
                onClick={() => {
                  onChange(
                    existing
                      ? rules.map((rule) =>
                          rule.id === draft.id ? draft : rule,
                        )
                      : [...rules, draft],
                  );
                  setDraft(null);
                }}
              >
                {existing ? "Update rule" : "Create rule"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setDraft(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        <p className="text-xs text-muted-foreground">Ranges follow the original row order. Inserted rows and columns are excluded until you update the range.</p>
        </div>
      </AppDialogContent>
    </Dialog>
  );
}
