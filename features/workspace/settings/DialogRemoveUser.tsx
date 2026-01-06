"use client";

import { useId, useState } from "react";
import { PiUserXDuotone } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  const disabled = value !== userName;

  function handleConfirm() {
    if (disabled) return;
    console.log(`Removing user: ${userId}`);
    setOpen(false);
    setValue("");
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
            <UserX className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Remove User</DialogTitle>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <p className="text-xs text-muted-foreground">
            You are about to remove <strong>{userName}</strong> from the
            workspace. This action cannot be undone.
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
              Remove
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
