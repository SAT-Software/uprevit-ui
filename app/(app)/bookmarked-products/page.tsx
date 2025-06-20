"use client";

import { sampleProducts } from "@/app/(app)/products/page";
import { Button } from "@/components/ui/button";
import { PiPlusBold } from "react-icons/pi";
import { BookmarkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DialogCreateFolder from "@/features/bookmarks/DialogCreateFolder";

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

function BookmarkedProductsPage() {
  const router = useRouter();
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  const handleCreateFolder = (folderName: string) => {
    // TODO: Implement folder creation logic
    console.log("Creating folder:", folderName);
    // For now, just log the folder name
    // Later this would integrate with your state management/API
  };

  return (
    <div className="flex flex-col gap-8 p-4 h-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Bookmarked Products</h2>
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => setIsCreateFolderOpen(true)}
          >
            Create New Folder <PiPlusBold />
          </Button>
        </div>
        {mockFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4 text-muted-foreground">
            <BookmarkIcon className="w-16 h-16" />
            <p className="text-lg">
              No bookmark folders yet. Create one to save products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {mockFolders.map((folder) => (
              <Card
                key={folder.id}
                className="cursor-pointer shadow-none hover:shadow-none transition-all duration-200 hover:bg-muted/50"
                onClick={() => router.push(`/bookmarked-products/${folder.id}`)}
              >
                <CardContent className="p-6 flex flex-row items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-muted border border-input flex items-center justify-center">
                    <BookmarkIcon className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="">
                    <p className="font-medium text-sm mb-1">{folder.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {folder.productCount} items
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <DialogCreateFolder
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
}

export default BookmarkedProductsPage;
