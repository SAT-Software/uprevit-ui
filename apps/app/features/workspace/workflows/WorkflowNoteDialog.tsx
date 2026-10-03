"use client";

import { useId, useState } from "react";
import type { IconSvgElement } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupTextarea,
} from "@uprevit/ui/components/ui/input-group";
import { Button } from "@uprevit/ui/components/ui/button";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";

const NOTE_MAX_LENGTH = 1000;

function WorkflowNoteForm({
  formId,
  noteLabel,
  noteTooltip,
  notePlaceholder,
  required,
  onSubmit,
}: {
  formId: string;
  noteLabel: string;
  noteTooltip: string;
  notePlaceholder: string;
  required: boolean;
  onSubmit: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  const [showError, setShowError] = useState(false);
  const trimmed = note.trim();
  const error =
    required && !trimmed
      ? `${noteLabel} is required`
      : trimmed.length > NOTE_MAX_LENGTH
        ? `${noteLabel} must be at most ${NOTE_MAX_LENGTH} characters`
        : undefined;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (error) {
      setShowError(true);
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate>
      <FieldGroup className="px-4 pb-4">
        <Field data-invalid={showError && !!error}>
          <FormFieldLabel
            htmlFor={`${formId}-note`}
            label={noteLabel}
            tooltip={noteTooltip}
            optional={!required}
          />
          <InputGroup size="md" className="bg-background">
            <InputGroupTextarea
              id={`${formId}-note`}
              placeholder={notePlaceholder}
              className="min-h-24 resize-none"
              maxLength={NOTE_MAX_LENGTH}
              aria-invalid={showError && !!error}
              aria-describedby={
                showError && error ? `${formId}-error` : undefined
              }
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </InputGroup>
          {showError && error ? (
            <FieldError id={`${formId}-error`} errors={[{ message: error }]} />
          ) : null}
        </Field>
      </FieldGroup>
    </form>
  );
}

export function WorkflowNoteDialog({
  open,
  onOpenChange,
  title,
  variant,
  heading,
  message,
  icon,
  noteLabel,
  noteTooltip,
  notePlaceholder,
  required,
  submitLabel,
  submitLoadingLabel,
  submitIcon,
  submitVariant,
  isPending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  variant: "confirm" | "confirm-destructive";
  heading: string;
  message: React.ReactNode;
  icon: IconSvgElement;
  noteLabel: string;
  noteTooltip: string;
  notePlaceholder: string;
  required: boolean;
  submitLabel: string;
  submitLoadingLabel: string;
  submitIcon: IconSvgElement;
  submitVariant?: React.ComponentProps<typeof Button>["variant"];
  isPending: boolean;
  onSubmit: (note: string) => void;
}) {
  const formId = `workflow-note-form-${useId()}`;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) onOpenChange(next);
      }}
    >
      <AppDialogContent
        title={title}
        description={heading}
        variant={variant}
        size="md"
        confirmContent={{ heading, message, icon }}
        primaryAction={{
          label: submitLabel,
          loadingLabel: submitLoadingLabel,
          form: formId,
          type: "submit",
          loading: isPending,
          disabled: isPending,
          icon: submitIcon,
          variant: submitVariant,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      >
        <WorkflowNoteForm
          formId={formId}
          noteLabel={noteLabel}
          noteTooltip={noteTooltip}
          notePlaceholder={notePlaceholder}
          required={required}
          onSubmit={onSubmit}
        />
      </AppDialogContent>
    </Dialog>
  );
}
