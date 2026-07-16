"use client";

import { useRouter } from "next/navigation";

import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { useCreateProductVersion } from "@/hooks/product/useCreateProductVersion";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  GitBranchIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";

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
      <AppDialogContent
        title="Create New Version"
        description="Create a new version of this product. The new version will be a copy of the current version with a fresh draft status."
        variant="confirm"
        size="md"
        confirmContent={{
          heading: `Create Version ${newVersion}`,
          message: (
            <>
              This will create a new draft version of{" "}
              <span className="font-medium text-foreground">
                {product.product_name || "this product"}
              </span>{" "}
              based on Version {currentVersion}.
            </>
          ),
          icon: GitBranchIcon,
        }}
        primaryAction={{
          label: `Create Version ${newVersion}`,
          loadingLabel: "Creating...",
          onClick: handleCreateVersion,
          loading: isPending,
          disabled: isPending || !canCreateVersion,
          icon: GitBranchIcon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      >
        <div className="space-y-4 px-4 pb-4">
          <div className="space-y-2 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-sm">
              <Icon
                icon={InformationCircleIcon}
                size={16}
                className="text-muted-foreground"
              />
              <span className="text-muted-foreground">What will happen:</span>
            </div>
            <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
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

          {!canCreateVersion ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                You can only create a new version from a submitted product.
                Current status:{" "}
                <Badge variant="outline">{product.status}</Badge>
              </p>
            </div>
          ) : null}
        </div>
      </AppDialogContent>
    </Dialog>
  );
}
