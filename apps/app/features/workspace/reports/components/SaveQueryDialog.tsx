"use client";

import { useCallback, useId, useState } from "react";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import {
  Cancel01Icon,
  InformationCircleIcon,
  SaveIcon,
} from "@hugeicons/core-free-icons";

interface SaveQueryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  isConditionsEmpty: boolean;
}

export function SaveQueryDialog({
  open,
  onOpenChange,
  onSave,
  isConditionsEmpty,
}: SaveQueryDialogProps) {
  const inputId = useId();
  const [name, setName] = useState("");

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setName("");
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  const handleSave = useCallback(() => {
    if (!name.trim()) return;

    onSave(name.trim());
    setName("");
    onOpenChange(false);
  }, [name, onSave, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent
        title="Save Query"
        description="Save your current query conditions for later use."
        variant="form"
        size="sm"
        primaryAction={{
          label: "Save Query",
          onClick: handleSave,
          disabled: !name.trim() || isConditionsEmpty,
          icon: SaveIcon,
        }}
        secondaryAction={{
          label: "Cancel",
          icon: Cancel01Icon,
        }}
      >
        <FieldGroup className="gap-2 p-4">
          <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/50 p-3">
            <Icon
              icon={InformationCircleIcon}
              size={16}
              strokeWidth={2}
              className="mt-0.5 shrink-0 text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Saved queries are stored locally in your browser. They will not
              sync across devices and may be lost if you clear browser data.
            </p>
          </div>

          <Field>
            <FormFieldLabel htmlFor={inputId} label="Query name" />
            <InputGroup size="md">
              <InputGroupInput
                id={inputId}
                placeholder="e.g., OUS Products with CE Marking"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                autoFocus
              />
            </InputGroup>
          </Field>
        </FieldGroup>
      </AppDialogContent>
    </Dialog>
  );
}
