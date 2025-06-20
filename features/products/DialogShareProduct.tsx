import { Share2Icon, LinkIcon, CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DialogShareProduct({
  open,
  onOpenChange,
  product,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: any;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const productLink = product?.productId
    ? `${window.location.origin}/products/${product.productId}`
    : "/products/sample-id";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  // If external state control is provided, use controlled mode
  if (open !== undefined && onOpenChange !== undefined) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Share2Icon size={20} />
              Share Product
            </AlertDialogTitle>
            <AlertDialogDescription>
              Share this product with others by copying the link below.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-link">Product Link</Label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <LinkIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    id="product-link"
                    value={productLink}
                    readOnly
                    className="pl-10"
                  />
                </div>
                <Button size="sm" onClick={handleCopyLink} className="shrink-0">
                  {copied ? (
                    <>
                      <CheckIcon size={16} className="mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <CopyIcon size={16} className="mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {product?.productName && (
              <div className="rounded-lg border p-3 bg-muted/50">
                <h4 className="font-medium text-sm">{product.productName}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Product ID: {product.productId}
                </p>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Original trigger-based mode
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children || (
          <div className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent text-foreground cursor-pointer focus:bg-accent focus:text-accent-foreground">
            <Share2Icon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Share</span>
          </div>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Share2Icon size={20} />
            Share Product
          </AlertDialogTitle>
          <AlertDialogDescription>
            Share this product with others by copying the link below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-link-standalone">Product Link</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <LinkIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  id="product-link-standalone"
                  value={productLink}
                  readOnly
                  className="pl-10"
                />
              </div>
              <Button size="sm" onClick={handleCopyLink} className="shrink-0">
                {copied ? (
                  <>
                    <CheckIcon size={16} className="mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <CopyIcon size={16} className="mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {product?.productName && (
            <div className="rounded-lg border p-3 bg-muted/50">
              <h4 className="font-medium text-sm">{product.productName}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Product ID: {product.productId}
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
