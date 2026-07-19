"use client";

import { useState, useMemo, useCallback, useId } from "react";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import {
  Cancel01Icon,
  SearchReplaceIcon,
} from "@hugeicons/core-free-icons";

interface FindReplaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cellData: Record<string, string>;
  onReplace: (updatedCells: Record<string, string>) => void;
}

export function FindReplaceDialog({
  open,
  onOpenChange,
  cellData,
  onReplace,
}: FindReplaceDialogProps) {
  const findId = useId();
  const replaceId = useId();
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");

  const matches = useMemo(() => {
    if (!findText.trim()) return [];
    const searchTerm = findText.toLowerCase();
    return Object.entries(cellData)
      .filter(([, value]) => value.toLowerCase().includes(searchTerm))
      .map(([key]) => key);
  }, [cellData, findText]);

  const resetForm = useCallback(() => {
    setFindText("");
    setReplaceText("");
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetForm();
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange, resetForm],
  );

  const handleReplaceAll = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (matches.length === 0) return;

      const updated = { ...cellData };

      matches.forEach((key) => {
        const currentValue = updated[key];
        const regex = new RegExp(
          findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "gi",
        );
        updated[key] = currentValue.replace(regex, replaceText);
      });

      onReplace(updated);
      handleOpenChange(false);
    },
    [matches, findText, replaceText, cellData, onReplace, handleOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent
        title="Find & Replace"
        description="Search and replace text across all cells in the table."
        variant="form"
        size="md"
        wrapBodyInFieldGroup
        primaryAction={{
          label: "Replace All",
          onClick: handleReplaceAll,
          disabled: matches.length === 0,
          icon: SearchReplaceIcon,
        }}
        secondaryAction={{
          label: "Cancel",
          icon: Cancel01Icon,
        }}
      >
        <Field>
          <FormFieldLabel htmlFor={findId} label="Find" />
          <InputGroup size="md">
            <InputGroupInput
              id={findId}
              placeholder="Text to find..."
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              autoFocus
            />
          </InputGroup>
        </Field>

        <Field>
          <FormFieldLabel htmlFor={replaceId} label="Replace with" />
          <InputGroup size="md">
            <InputGroupInput
              id={replaceId}
              placeholder="Replacement text..."
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
            />
          </InputGroup>
        </Field>

        {findText.trim() ? (
          <p className="text-sm text-muted-foreground">
            {matches.length === 0
              ? "No matches found"
              : `${matches.length} cell${
                  matches.length === 1 ? "" : "s"
                } found with matching text`}
          </p>
        ) : null}
      </AppDialogContent>
    </Dialog>
  );
}
