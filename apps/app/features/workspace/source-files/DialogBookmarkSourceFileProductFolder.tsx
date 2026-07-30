"use client";

import { useState } from "react";

import { Button } from "@uprevit/ui/components/ui/button";
import { Card, CardContent } from "@uprevit/ui/components/ui/card";
import { Checkbox } from "@uprevit/ui/components/ui/checkbox";
import { Dialog, DialogClose, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { FieldLabel } from "@uprevit/ui/components/ui/field";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Bookmark01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";

type Product = {
  productId: string;
  productName: string;
  description: string;
  version: number;
  status: string;
  projectId: string;
  departmentId: string;
  createdBy: string;
  modifiedBy: string;
  createdOn: string;
  modifiedOn: string;
  targetDate: number | null;
  completionDate: number | null;
  delayReason: string | null;
};

interface DialogBookmarkSourceFileProductFolderProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  allProducts: Product[];
  currentBookmarkedProducts?: Product[];
  onBookmarkUpdate?: (bookmarkedProducts: Product[]) => void;
}

export default function DialogBookmarkSourceFileProductFolder({
  open,
  onOpenChange,
  children,
  allProducts,
  currentBookmarkedProducts = [],
  onBookmarkUpdate,
}: DialogBookmarkSourceFileProductFolderProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    currentBookmarkedProducts.map((p) => p.productId),
  );
  const [internalOpen, setInternalOpen] = useState<boolean>(false);

  const handleReset = () => {
    setSelectedProducts(currentBookmarkedProducts.map((p) => p.productId));
  };

  const handleBookmarkProducts = () => {
    const bookmarkedProducts = allProducts.filter((product) =>
      selectedProducts.includes(product.productId),
    );
    onBookmarkUpdate?.(bookmarkedProducts);
    onOpenChange?.(false);
    setInternalOpen(false);
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const isCurrentlyBookmarked = (productId: string) => {
    return currentBookmarkedProducts.some((p) => p.productId === productId);
  };

  const handleClose = () => {
    onOpenChange?.(false);
    setInternalOpen(false);
    handleReset();
  };

  const dialogContent = (
    <AppDialogContent
      title="Bookmark Product Folders"
      description="Select products to bookmark for quick access. Currently bookmarked products are highlighted."
      variant="custom"
      className="sm:max-w-2xl"
      bodyClassName="overflow-hidden p-0 [&>[data-slot=scroll-area-viewport]]:overflow-hidden"
      footer={
        <>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClose}
            >
              <Icon icon={Cancel01Icon} size={16} strokeWidth={2} />
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" size="sm" onClick={handleBookmarkProducts}>
            <Icon icon={CheckmarkCircle01Icon} size={16} strokeWidth={2} />
            Update Bookmarks
            {selectedProducts.length > 0 ? ` (${selectedProducts.length})` : ""}
          </Button>
        </>
      }
    >
      <div className="flex max-h-[400px] flex-col gap-4 overflow-hidden p-4">
        <FieldLabel className="text-sm font-medium">
          All Products ({selectedProducts.length} selected)
        </FieldLabel>

        <div className="flex-1 overflow-y-auto rounded-md border p-4">
          <div className="space-y-2">
            {allProducts.map((product) => {
              const isBookmarked = isCurrentlyBookmarked(product.productId);
              const isSelected = selectedProducts.includes(product.productId);

              return (
                <Card
                  key={product.productId}
                  className={`h-20 cursor-pointer transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : isBookmarked
                        ? "border-blue-300 bg-blue-50"
                        : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleProductToggle(product.productId)}
                >
                  <CardContent className="h-full p-3">
                    <div className="flex h-full items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleProductToggle(product.productId)}
                        className="shrink-0"
                      />
                      <div className="flex min-w-0 flex-1 items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="truncate text-sm font-medium">
                              {product.productName}
                            </h4>
                            <span className="shrink-0 rounded bg-muted px-2 py-1 text-xs">
                              v{product.version}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className={`rounded px-2 py-1 text-xs ${
                                product.status === "Draft"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : product.status === "Submitted"
                                    ? "bg-blue-100 text-blue-800"
                                    : product.status === "Archived"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-green-100 text-green-800"
                              }`}
                            >
                              {product.status}
                            </span>
                            {isBookmarked ? (
                              <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                Currently Bookmarked
                              </span>
                            ) : null}
                          </div>
                        </div>
                        {isSelected ? (
                          <Icon
                            icon={CheckmarkCircle01Icon}
                            size={16}
                            className="ml-2 shrink-0 text-primary"
                          />
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppDialogContent>
  );

  if (open !== undefined && onOpenChange !== undefined) {
    return (
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          onOpenChange(newOpen);
          if (!newOpen) handleReset();
        }}
      >
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog
      open={internalOpen}
      onOpenChange={(newOpen) => {
        setInternalOpen(newOpen);
        if (!newOpen) handleReset();
      }}
    >
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="flex items-center gap-2">
            <Icon icon={Bookmark01Icon} />
            Bookmark Products
          </Button>
        )}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
