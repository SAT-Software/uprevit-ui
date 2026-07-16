"use client";

import { useMemo, useState } from "react";

import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import { Field, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  Copy01Icon,
  Link01Icon,
  Share08Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";

export default function DialogShareProduct({
  open,
  onOpenChange,
  product,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: { _id: string; product_name?: string };
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const productLink = useMemo(() => {
    if (typeof window === "undefined") {
      return "/products/sample-id";
    }
    return product?._id
      ? `${window.location.origin}/products/${product._id}/product-information`
      : "/products/sample-id";
  }, [product?._id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const dialogContent = (
    <AppDialogContent
      title="Share Product"
      description="Share this product with others by copying the link below."
      subtitle="Copy the link below and send it to workspace members."
      variant="inform"
      size="lg"
      secondaryAction={{
        label: "Close",
        icon: Cancel01Icon,
      }}
    >
      <FieldGroup className="gap-4 p-4">
        <Field>
          <FormFieldLabel
            htmlFor="product-link"
            label="Product Link"
            tooltip="Anyone with this link who belongs to the workspace can open this product."
          />
          <div className="flex items-center gap-2">
            <InputGroup size="md" className="bg-background">
              <InputGroupAddon>
                <Icon icon={Link01Icon} size={16} strokeWidth={2} />
              </InputGroupAddon>
              <InputGroupInput
                id="product-link"
                value={productLink}
                readOnly
              />
            </InputGroup>
            <Button
              type="button"
              size="sm"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              <Icon
                icon={copied ? Tick01Icon : Copy01Icon}
                size={16}
                strokeWidth={2}
              />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </Field>

        {product?.product_name ? (
          <div className="rounded-lg border bg-muted/50 p-3">
            <h4 className="text-sm font-medium">{product.product_name}</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Product ID: {product._id}
            </p>
          </div>
        ) : null}
      </FieldGroup>
    </AppDialogContent>
  );

  if (open !== undefined && onOpenChange !== undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <div className="focus:bg-accent hover:bg-accent focus:text-accent-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none">
            <Icon
              icon={Share08Icon}
              size={16}
              className="text-muted-foreground"
            />
            <span>Share</span>
          </div>
        )}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
