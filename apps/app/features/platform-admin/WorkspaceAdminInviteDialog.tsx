"use client";

import { useId, useState } from "react";
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
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { useInviteWorkspaceAdmin } from "@/hooks/platform-admin/useInviteWorkspaceAdmin";
import {
  PiPaperPlaneRightDuotone,
  PiUserPlusDuotone,
  PiUsersDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

export function WorkspaceAdminInviteDialog({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const mutation = useInviteWorkspaceAdmin(workspaceId);

  const resetForm = () => {
    setEmail("");
    setName("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !name || mutation.isPending) return;

    await mutation.mutateAsync({ email, name });
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="gap-2">
          <PiUserPlusDuotone className="h-4 w-4" />
          Invite org admin
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="flex w-full items-center justify-between border-b bg-accent px-4 py-4 text-sm">
            <div className="flex items-center gap-2">
              <PiUsersDuotone className="h-5 w-5 text-muted-foreground" />
              <p>Invite org admin</p>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
          <div className="border-b bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            Adds an admin to this workspace. They complete onboarding before
            accessing the workspace.
          </div>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Invite an administrator to an existing organization workspace.
        </DialogDescription>

        <form
          id={formId}
          className="overflow-y-auto p-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-admin-name">Name</Label>
              <Input
                id="workspace-admin-name"
                placeholder="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspace-admin-email">Email</Label>
              <Input
                id="workspace-admin-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>
        </form>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={mutation.isPending}
            >
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            size="sm"
            form={formId}
            disabled={!email || !name || mutation.isPending}
            aria-busy={mutation.isPending}
          >
            {mutation.isPending ? (
              <Spinner />
            ) : (
              <PiPaperPlaneRightDuotone />
            )}
            {mutation.isPending ? "Sending..." : "Send invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
