"use client";

import { useId, useMemo, useState } from "react";
import { CircleAlert as CircleAlertIcon } from "lucide-react";

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
import Link from "next/link";
import { useArchiveDepartment } from "@/hooks/department/useArchiveDepartment";
import { useArchiveProject } from "@/hooks/project/useArchiveProject";
import { useArchiveProduct } from "@/hooks/product/useArchiveProduct";

export type ArchiveEntityType = "project" | "department" | "product";

export interface DialogArchiveEntityProps {
  id: string;
  entityName: string;
  entityType: ArchiveEntityType;
  trigger: React.ReactNode;
}

export default function DialogArchiveEntity({
  id,
  entityName,
  entityType,
  trigger,
}: DialogArchiveEntityProps) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  // Prepare mutations
  const departmentArchive = useArchiveDepartment();
  const projectArchive = useArchiveProject();
  const productArchive = useArchiveProduct();

  const { mutateAsync, isPending } = useMemo(() => {
    switch (entityType) {
      case "department":
        return departmentArchive;
      case "project":
        return projectArchive;
      case "product":
        return productArchive;
      default:
        return departmentArchive;
    }
  }, [entityType, departmentArchive, projectArchive, productArchive]);

  const disabled = value !== entityName || isPending;

  async function handleConfirm() {
    if (disabled) return;
    await mutateAsync(id);
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
            <CircleAlertIcon className="opacity-80" size={16} />
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
          <div className="*:not-first:mt-2">
            <Label htmlFor={inputId}>
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
              {isPending ? "Archiving..." : "Archive"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
