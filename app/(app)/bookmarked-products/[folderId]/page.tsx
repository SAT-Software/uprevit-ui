"use client";

import { sampleProducts } from "@/app/(app)/products/page";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import DialogAddProductsToFolder from "@/features/bookmarks/DialogAddProductsToFolder";

// Mock data for folders
const mockFolders = [
  {
    id: "folder-1",
    name: "Engineering Projects",
    description: "Core engineering projects and components",
    productCount: 12,
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-20T15:30:00Z",
    products: sampleProducts.slice(0, 3),
  },
  {
    id: "folder-2",
    name: "Design Resources",
    description: "UI/UX design assets and templates",
    productCount: 5,
    createdAt: "2024-03-10T09:00:00Z",
    updatedAt: "2024-03-18T11:20:00Z",
    products: sampleProducts.slice(3, 6),
  },
  {
    id: "folder-3",
    name: "Marketing Assets",
    description: "Marketing materials and campaigns",
    productCount: 8,
    createdAt: "2024-03-05T14:00:00Z",
    updatedAt: "2024-03-19T16:45:00Z",
    products: sampleProducts.slice(6, 9),
  },
];

export default function FolderPage() {
  const router = useRouter();
  const params = useParams();
  const folderId = params.folderId as string;
  const [isAddProductsOpen, setIsAddProductsOpen] = useState(false);

  // Find the folder by ID
  const folder = mockFolders.find((f) => f.id === folderId) || {
    id: "unknown",
    name: "Unknown Folder",
    description: "This folder could not be found",
    productCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    products: [],
  };

  const handleAddProducts = (productIds: string[]) => {
    // TODO: Implement add products to folder logic
    console.log("Adding products to folder:", { folderId, productIds });
    // For now, just log the product IDs
    // Later this would integrate with your state management/API
  };

  return (
    <div className="flex flex-col gap-8 p-4 h-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderIcon className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-semibold">{folder.name}</h1>
          </div>
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => setIsAddProductsOpen(true)}
          >
            <PlusIcon size={16} />
            Add Products
          </Button>
        </div>
        <p className="text-sm text-muted-foreground ml-9">
          {folder.description}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {folder.products.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No products in this folder yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {folder.products.map((product) => (
              <Card
                key={product.productId}
                className="hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() =>
                  router.push(
                    `/products/${product.productId}/product-information`
                  )
                }
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{product.productName}</h3>
                      <span className="text-sm text-muted-foreground">
                        v{product.version}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Project: {product.projectId}</span>
                      <span>Status: {product.status}</span>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>
                        Last modified:{" "}
                        {new Date(product.modifiedOn).toLocaleDateString()}
                      </span>
                      <span>by {product.modifiedBy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <DialogAddProductsToFolder
        open={isAddProductsOpen}
        onOpenChange={setIsAddProductsOpen}
        folderName={folder.name}
        onAddProducts={handleAddProducts}
      />
    </div>
  );
}
