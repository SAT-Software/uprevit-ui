"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@uprevit/ui/components/ui/dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import { useCreateProductVersion } from "@/hooks/product/useCreateProductVersion";
import {
  PiGitMergeDuotone,
  PiInfoDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { Badge } from "@uprevit/ui/components/ui/badge";

interface DialogCreateVersionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    _id: string;
    product_name?: string;
    version?: number;
    status?: string;
  };
}

export default function DialogCreateVersion({
  open,
  onOpenChange,
  product,
}: DialogCreateVersionProps) {
  const router = useRouter();
  const { mutate: createVersion, isPending } = useCreateProductVersion();

  const currentVersion = product.version || 1;
  const newVersion = currentVersion + 1;

  const canCreateVersion = product.status === "submitted";

  async function handleCreateVersion(e: React.MouseEvent) {
    e.preventDefault();
    if (!product._id || !canCreateVersion) return;

    createVersion(product._id, {
      onSuccess: (data) => {
        onOpenChange(false);
        router.push(`/products/${data.product._id}/product-information`);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Create New Version</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Create a new version of this product. The new version will be a copy
          of the current version with a fresh draft status.
        </DialogDescription>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500"
              aria-hidden="true"
            >
              <PiGitMergeDuotone size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-sm">
                Create Version {newVersion}
              </h4>
              <p className="text-sm text-muted-foreground">
                This will create a new draft version of{" "}
                <span className="font-medium text-foreground">
                  {product.product_name || "this product"}
                </span>{" "}
                based on Version {currentVersion}.
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <PiInfoDuotone className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">What will happen:</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>All data will be copied to the new version</li>
              <li>
                Status will be set to{" "}
                <Badge variant="outline" className="ml-1">
                  Draft
                </Badge>
              </li>
              <li>All tabs will be marked as incomplete</li>
              <li>
                Version {currentVersion} will be accessible in version history
              </li>
            </ul>
          </div>

          {!canCreateVersion && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                You can only create a new version from a submitted product.
                Current status:{" "}
                <Badge variant="outline">{product.status}</Badge>
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isPending}
            >
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={handleCreateVersion}
            disabled={isPending || !canCreateVersion}
          >
            {isPending ? <Spinner /> : <PiGitMergeDuotone />}
            {isPending ? "Creating..." : `Create Version ${newVersion}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
