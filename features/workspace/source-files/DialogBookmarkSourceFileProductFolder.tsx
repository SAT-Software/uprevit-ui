import { BookmarkIcon, CheckIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Product type definition
type Product = {
  productId: string;
  productName: string;
  description: string;
  version: string;
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
    currentBookmarkedProducts.map((p) => p.productId)
  );
  const [internalOpen, setInternalOpen] = useState<boolean>(false);

  const handleReset = () => {
    setSelectedProducts(currentBookmarkedProducts.map((p) => p.productId));
  };

  const handleBookmarkProducts = () => {
    const bookmarkedProducts = allProducts.filter((product) =>
      selectedProducts.includes(product.productId)
    );
    onBookmarkUpdate?.(bookmarkedProducts);
    onOpenChange?.(false);
    setInternalOpen(false);
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isCurrentlyBookmarked = (productId: string) => {
    return currentBookmarkedProducts.some((p) => p.productId === productId);
  };

  const dialogContent = (
    <DialogContent className="max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <BookmarkIcon size={20} />
          Bookmark Product Folders
        </DialogTitle>
        <DialogDescription>
          Select products to bookmark for quick access. Currently bookmarked
          products are highlighted.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
        <Label className="text-sm font-medium">
          All Products ({selectedProducts.length} selected)
        </Label>

        <div className="flex-1 w-full overflow-y-scroll rounded-md border p-4 max-h-[400px]">
          <div className="space-y-2">
            {allProducts.map((product) => {
              const isBookmarked = isCurrentlyBookmarked(product.productId);
              const isSelected = selectedProducts.includes(product.productId);

              return (
                <Card
                  key={product.productId}
                  className={`cursor-pointer transition-colors h-20 ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : isBookmarked
                      ? "border-blue-300 bg-blue-50"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleProductToggle(product.productId)}
                >
                  <CardContent className="p-3 h-full">
                    <div className="flex items-center gap-3 h-full">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleProductToggle(product.productId)}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm truncate">
                              {product.productName}
                            </h4>
                            <span className="text-xs bg-muted px-2 py-1 rounded flex-shrink-0">
                              v{product.version}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
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
                            {isBookmarked && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Currently Bookmarked
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckIcon
                            size={16}
                            className="text-primary flex-shrink-0 ml-2"
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            onOpenChange?.(false);
            setInternalOpen(false);
            handleReset();
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleBookmarkProducts}>
          Update Bookmarks
          {selectedProducts.length > 0 && ` (${selectedProducts.length})`}
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  // If external state control is provided, use controlled mode
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

  // Original trigger-based mode
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
            <BookmarkIcon size={16} />
            Bookmark Products
          </Button>
        )}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
