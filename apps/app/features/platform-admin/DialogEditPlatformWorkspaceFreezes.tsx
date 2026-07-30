"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { FieldGroup } from "@uprevit/ui/components/ui/field";
import { Label } from "@uprevit/ui/components/ui/label";
import { Switch } from "@uprevit/ui/components/ui/switch";
import {
  Cancel01Icon,
  LockIcon,
  PropertyEditIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import type { WorkspaceFreezes } from "@/types/billing";
import { PlatformBillingConfirmDialog } from "@/features/platform-admin/PlatformBillingConfirmDialog";

type FreezeForm = {
  usageFreezeEnabled: boolean;
  accessFreezeEnabled: boolean;
};

function describeFreezeChanges(
  form: FreezeForm,
  freezes: WorkspaceFreezes,
): string[] {
  const changes: string[] = [];
  if (form.usageFreezeEnabled !== freezes.usageFreeze.enabled) {
    changes.push(
      `Usage freeze: ${freezes.usageFreeze.enabled ? "on" : "off"} → ${form.usageFreezeEnabled ? "on" : "off"}`,
    );
  }
  if (form.accessFreezeEnabled !== freezes.accessFreeze.enabled) {
    changes.push(
      `Access freeze: ${freezes.accessFreeze.enabled ? "on" : "off"} → ${form.accessFreezeEnabled ? "on" : "off"}`,
    );
  }
  return changes;
}

export function DialogEditPlatformWorkspaceFreezes({
  freezes,
  isPending,
  onSave,
}: {
  freezes: WorkspaceFreezes;
  isPending: boolean;
  onSave: (input: {
    usageFreezeEnabled?: boolean;
    accessFreezeEnabled?: boolean;
  }) => Promise<void>;
}) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState<FreezeForm>({
    usageFreezeEnabled: freezes.usageFreeze.enabled,
    accessFreezeEnabled: freezes.accessFreeze.enabled,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setForm({
        usageFreezeEnabled: freezes.usageFreeze.enabled,
        accessFreezeEnabled: freezes.accessFreeze.enabled,
      });
    }
    setOpen(nextOpen);
  };

  const hasChanges = useMemo(
    () =>
      form.usageFreezeEnabled !== freezes.usageFreeze.enabled ||
      form.accessFreezeEnabled !== freezes.accessFreeze.enabled,
    [form, freezes],
  );

  const changeSummary = useMemo(
    () => (open ? describeFreezeChanges(form, freezes) : []),
    [open, form, freezes],
  );

  const handleSaveClick = () => {
    if (!hasChanges) return;
    setConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    const payload: {
      usageFreezeEnabled?: boolean;
      accessFreezeEnabled?: boolean;
    } = {};
    if (form.usageFreezeEnabled !== freezes.usageFreeze.enabled) {
      payload.usageFreezeEnabled = form.usageFreezeEnabled;
    }
    if (form.accessFreezeEnabled !== freezes.accessFreeze.enabled) {
      payload.accessFreezeEnabled = form.accessFreezeEnabled;
    }
    try {
      await onSave(payload);
      setConfirmOpen(false);
      setOpen(false);
    } catch {
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button size="sm" variant="secondary" className="gap-2">
            <Icon icon={PropertyEditIcon} size={14} strokeWidth={2} />
            Edit freezes
          </Button>
        </DialogTrigger>

        <AppDialogContent
          title="Edit workspace freezes"
          description="Edit usage and access freeze settings for this workspace."
          subtitle="These controls take effect immediately. They work independently of the billing account."
          variant="form"
          size="lg"
          primaryAction={{
            label: "Save changes",
            loadingLabel: "Saving…",
            form: formId,
            type: "submit",
            loading: isPending,
            disabled: isPending || !hasChanges,
            icon: Tick02Icon,
          }}
          secondaryAction={{
            label: "Cancel",
            disabled: isPending,
            icon: Cancel01Icon,
          }}
        >
          <form
            id={formId}
            onSubmit={(event) => {
              event.preventDefault();
              handleSaveClick();
            }}
            noValidate
          >
            <FieldGroup className="gap-3 p-4">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="space-y-1">
                  <Label htmlFor="usage-freeze">Usage freeze</Label>
                  <p className="text-xs text-muted-foreground">
                    Blocks invites, exports, and uploads.
                  </p>
                </div>
                <Switch
                  id="usage-freeze"
                  checked={form.usageFreezeEnabled}
                  onCheckedChange={(usageFreezeEnabled) =>
                    setForm((current) => ({ ...current, usageFreezeEnabled }))
                  }
                />
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="space-y-1">
                  <Label htmlFor="access-freeze">Access freeze</Label>
                  <p className="text-xs text-muted-foreground">
                    Blocks workspace login and all usage actions.
                  </p>
                </div>
                <Switch
                  id="access-freeze"
                  checked={form.accessFreezeEnabled}
                  onCheckedChange={(accessFreezeEnabled) =>
                    setForm((current) => ({ ...current, accessFreezeEnabled }))
                  }
                />
              </div>
            </FieldGroup>
          </form>
        </AppDialogContent>
      </Dialog>

      <PlatformBillingConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Apply workspace freeze changes?"
        icon={LockIcon}
        confirmLabel="Confirm save"
        isPending={isPending}
        onConfirm={handleConfirmSave}
        description={
          <div className="space-y-2">
            <p>These changes take effect immediately for the workspace:</p>
            <ul className="list-disc space-y-1 pl-4">
              {changeSummary.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        }
      />
    </>
  );
}
