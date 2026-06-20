"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@uprevit/ui/components/ui/dialog";
import { Label } from "@uprevit/ui/components/ui/label";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { Switch } from "@uprevit/ui/components/ui/switch";
import {
  PiChecksDuotone,
  PiLockDuotone,
  PiPencilCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import type { WorkspaceFreezes } from "@/types/billing";
import { PlatformBillingConfirmDialog } from "@/features/platform-admin/PlatformBillingConfirmDialog";
type FreezeForm = {
  usageFreezeEnabled: boolean;
  accessFreezeEnabled: boolean;
};

function describeFreezeChanges(form: FreezeForm, freezes: WorkspaceFreezes): string[] {
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
    const payload: { usageFreezeEnabled?: boolean; accessFreezeEnabled?: boolean } = {};
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
            <PiPencilCircleDuotone className="h-4 w-4" />
            Edit freezes
          </Button>
        </DialogTrigger>

        <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="flex w-full items-center justify-between border-b bg-accent px-4 py-4 text-sm">
              <div className="flex items-center gap-2">
                <PiLockDuotone className="h-5 w-5 text-muted-foreground" />
                <p>Edit workspace freezes</p>
              </div>
              <DialogClose asChild>
                <button type="button" className="cursor-pointer">
                  <PiXCircleDuotone size={18} />
                </button>
              </DialogClose>
            </DialogTitle>
            <div className="border-b bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              These controls take effect immediately. They work independently of the billing account.
            </div>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Edit usage and access freeze settings for this workspace.
          </DialogDescription>

          <form
            id={formId}
            className="overflow-y-auto p-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleSaveClick();
            }}
            noValidate
          >
            <div className="space-y-3">
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
            </div>
          </form>

          <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm" disabled={isPending}>
                <PiXCircleDuotone />
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              form={formId}
              disabled={isPending || !hasChanges}
              aria-busy={isPending}
            >
              {isPending ? <Spinner /> : <PiChecksDuotone />}
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PlatformBillingConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Apply workspace freeze changes?"
        icon={PiLockDuotone}
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
