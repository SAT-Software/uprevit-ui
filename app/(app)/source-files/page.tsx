"use client";

import { sampleProducts } from "@/app/(app)/products/page";
import { Button } from "@/components/ui/button";
import { PiPlusBold } from "react-icons/pi";
import { FolderIcon, BookmarkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DialogAddProductFolder from "@/features/source-files/DialogAddProductFolder";
import DialogBookmarkSourceFileProductFolder from "@/features/source-files/DialogBookmarkSourceFileProductFolder";

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

function SourceFilesPage() {
  const router = useRouter();

  // State for bookmarked products
  const [bookmarkedProducts, setBookmarkedProducts] = useState<Product[]>(
    sampleProducts.slice(0, 3) // Example: first 3 products as initial bookmarked
  );

  // For now, we'll show all products as folders
  const allProducts = sampleProducts;

  const handleBookmarkUpdate = (newBookmarkedProducts: Product[]) => {
    setBookmarkedProducts(newBookmarkedProducts);
  };

  return (
    <div className="flex flex-col gap-8 p-4 h-full">
      {/* Bookmarked Products Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Bookmarked Products</h2>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {bookmarkedProducts.map((product) => (
            <Card
              key={product.productId}
              className="cursor-pointer shadow-none hover:bg-muted/50 transition-colors"
              onClick={() =>
                router.push(`/source-files/view/${product.productId}`)
              }
            >
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <FolderIcon className="w-12 h-12 text-primary" />
                <div className="text-center">
                  <p className="font-medium text-sm">{product.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    v{product.version}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Products Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Products</h2>
          <div className="flex items-center gap-2">
            <DialogBookmarkSourceFileProductFolder
              allProducts={allProducts}
              currentBookmarkedProducts={bookmarkedProducts}
              onBookmarkUpdate={handleBookmarkUpdate}
            >
              <Button variant="outline" className="flex items-center gap-2">
                Bookmark Products <BookmarkIcon size={16} />
              </Button>
            </DialogBookmarkSourceFileProductFolder>
            <DialogAddProductFolder>
              <Button variant="default" className="flex items-center gap-2">
                Add Product Folder <PiPlusBold />
              </Button>
            </DialogAddProductFolder>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {allProducts.map((product) => (
            <Card
              key={product.productId}
              className="cursor-pointer shadow-none hover:bg-muted/50 transition-colors"
              onClick={() =>
                router.push(`/source-files/view/${product.productId}`)
              }
            >
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <FolderIcon className="w-12 h-12 text-primary" />
                <div className="text-center">
                  <p className="font-medium text-sm">{product.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    v{product.version}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SourceFilesPage;
