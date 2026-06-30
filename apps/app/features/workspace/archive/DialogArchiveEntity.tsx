"use client";

import { toast } from "sonner";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { useId, useMemo, useState } from "react";
import { PiWarningCircleDuotone } from "react-icons/pi";

import { Button, buttonVariants } from "@uprevit/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@uprevit/ui/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import Link from "next/link";
import { useArchiveDepartment } from "@/hooks/department/useArchiveDepartment";
import { useArchiveProject } from "@/hooks/project/useArchiveProject";
import { PiArchiveDuotone } from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { cn } from "@uprevit/ui/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArchiveIcon } from "@hugeicons/core-free-icons";

export type ArchiveEntityType = "project" | "department";

export interface DialogArchiveEntityProps {
  id: string;
  entityName: string;
  entityType: ArchiveEntityType;
}

export default function DialogArchiveEntity({
  id,
  entityName,
  entityType,
}: DialogArchiveEntityProps) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);

  // Prepare mutations
  const departmentArchive = useArchiveDepartment();
  const projectArchive = useArchiveProject();

  const { mutateAsync, isPending } = useMemo(() => {
    switch (entityType) {
      case "department":
        return departmentArchive;
      case "project":
        return projectArchive;
      default:
        throw new Error(`Invalid entity type: ${entityType}`);
    }
  }, [entityType, departmentArchive, projectArchive]);

  const disabled = value.trim() !== entityName.trim() || isPending;

  async function handleConfirm() {
    if (!isAdmin) {
      toast.warning("Insufficient privileges, contact Admin");
      return;
    }
    if (disabled) return;
    await mutateAsync(id);
    setOpen(false);
    setValue("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                if (!isAdmin) {
                  e.preventDefault();
                  e.stopPropagation();
                  toast.warning("Insufficient privileges, contact Admin");
                  return;
                }
              }}
            >
              <HugeiconsIcon
                className="transition-colors delay-100 duration-200 ease-in-out"
                icon={ArchiveIcon}
                size={16}
                strokeWidth={2}
              />
              Archive
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              Archive the department. This action is reversible and you can
              restore the department from
              <Link
                href="/archive"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-xs -mx-1",
                )}
              >
                Archive
              </Link>
              page.
            </div>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-start gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <PiWarningCircleDuotone className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Final confirmation
            </DialogTitle>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <p className="text-xs text-muted-foreground">
            You are archiving {entityType} <strong>{entityName}</strong>. You
            can restore your {entityType} anytime from the{" "}
            <Link href="/archive" className="underline underline-offset-4">
              Archive page
            </Link>
            .
          </p>
          <div className="space-y-4">
            <Label htmlFor={inputId} className="mb-1">
              {entityType.charAt(0).toUpperCase() + entityType.slice(1)} name
            </Label>
            <Input
              id={inputId}
              type="text"
              placeholder={`Type ${entityName} to confirm`}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="flex-1"
              disabled={disabled}
              onClick={handleConfirm}
            >
              {isPending ? <Spinner /> : <PiArchiveDuotone />}
              {isPending ? "Archiving..." : "Archive"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
