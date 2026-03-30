import { PiLinkDuotone, PiCopyDuotone, PiCheckDuotone } from "react-icons/pi";
import { PiShareNetworkDuotone, PiXCircleDuotone } from "react-icons/pi";
import { useState, useMemo } from "react";

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
import { Button } from "@uprevit/ui/components/ui/button";
import { Label } from "@uprevit/ui/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";

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
    <>
      <DialogHeader className="contents space-y-0 text-left">
        <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
          <p>Share Product</p>
          <DialogClose asChild>
            <button type="button" className="cursor-pointer">
              <PiXCircleDuotone size={18} />
            </button>
          </DialogClose>
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className="sr-only">
        Share this product with others by copying the link below.
      </DialogDescription>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product-link">Product Link</Label>
          <div className="flex items-center space-x-2">
            <InputGroup>
              <InputGroupInput
                id="product-link"
                value={productLink}
                readOnly
                className="pl-10"
              />
              <InputGroupAddon>
                <PiLinkDuotone size={16} />
              </InputGroupAddon>
            </InputGroup>
            <Button size="sm" onClick={handleCopyLink} className="shrink-0">
              {copied ? (
                <>
                  <PiCheckDuotone size={16} className="mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <PiCopyDuotone size={16} className="mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {product?.product_name && (
          <div className="rounded-lg border p-3 bg-muted/50">
            <h4 className="font-medium text-sm">{product.product_name}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Product ID: {product._id}
            </p>
          </div>
        )}
      </div>

      <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
        <DialogClose asChild>
          <Button variant="secondary" size="sm">
            <PiXCircleDuotone />
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );

  // If external state control is provided, use controlled mode
  if (open !== undefined && onOpenChange !== undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
          {dialogContent}
        </DialogContent>
      </Dialog>
    );
  }

  // Original trigger-based mode
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <div className="focus:bg-accent hover:bg-accent focus:text-accent-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none">
            <PiShareNetworkDuotone className="h-4 w-4 text-muted-foreground" />
            <span>Share</span>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}
