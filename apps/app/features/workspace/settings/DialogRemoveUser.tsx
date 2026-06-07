"use client";

import { useId, useState } from "react";
import { PiUserMinusDuotone } from "react-icons/pi";

import { Button } from "@uprevit/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@uprevit/ui/components/ui/dialog";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { useRemoveUser } from "@/hooks/user/useRemoveUser";

export interface DialogRemoveUserProps {
  userId: string;
  userName: string;
  trigger: React.ReactNode;
}

export default function DialogRemoveUser({
  userId,
  userName,
  trigger,
}: DialogRemoveUserProps) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const { mutate: removeUser, isPending } = useRemoveUser();

  const disabled = value !== userName || isPending;

  function handleConfirm() {
    if (disabled) return;

    removeUser(userId, {
      onSuccess: () => {
        setOpen(false);
        setValue("");
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-start gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <PiUserMinusDuotone className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Remove from workspace
            </DialogTitle>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <p className="text-xs text-muted-foreground">
            You are about to remove <strong>{userName}</strong> from this
            workspace. They will lose access immediately, but their historical
            activity in the workspace will be preserved.
          </p>
          <div className="space-y-4">
            <Label htmlFor={inputId} className="mb-1">
              User name
            </Label>
            <Input
              id={inputId}
              type="text"
              placeholder={`Type ${userName} to confirm`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="flex-1"
              disabled={disabled}
              onClick={handleConfirm}
            >
              {isPending ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
