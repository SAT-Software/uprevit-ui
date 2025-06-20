import { StarIcon, FolderIcon, PlusIcon, CheckIcon } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock bookmark folders - replace with real data later
const mockBookmarkFolders = [
  { id: "1", name: "Favorites", count: 12 },
  { id: "2", name: "Current Projects", count: 8 },
  { id: "3", name: "Archive Review", count: 5 },
  { id: "4", name: "Team Shared", count: 15 },
  { id: "5", name: "Personal Collection", count: 3 },
];

export default function DialogBookmarkProduct({
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
  const [selectedFolder, setSelectedFolder] = useState<string>("");

  const handleAddToBookmark = () => {
    if (selectedFolder) {
      // TODO: Implement bookmark functionality
      console.log(
        `Adding product ${product?.productId} to folder ${selectedFolder}`
      );
      onOpenChange?.(false);
    }
  };

  // If external state control is provided, use controlled mode
  if (open !== undefined && onOpenChange !== undefined) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <StarIcon size={20} />
              Add to Bookmarks
            </AlertDialogTitle>
            <AlertDialogDescription>
              Choose a folder to save this product to your bookmarks.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            {product?.productName && (
              <div className="rounded-lg border p-3 bg-muted/50">
                <h4 className="font-medium text-sm">{product.productName}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Product ID: {product.productId}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Select Bookmark Folder
              </Label>
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a folder..." />
                </SelectTrigger>
                <SelectContent>
                  {mockBookmarkFolders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      <div className="flex items-center gap-2 w-full">
                        <FolderIcon
                          size={16}
                          className="text-muted-foreground"
                        />
                        <span className="flex-1">{folder.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {folder.count} items
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Alternative: Show folders as clickable cards */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Or browse folders:</Label>
              <ScrollArea className="h-32 w-full rounded-md border p-2">
                <div className="space-y-2">
                  {mockBookmarkFolders.map((folder) => (
                    <Button
                      key={folder.id}
                      variant={
                        selectedFolder === folder.id ? "default" : "ghost"
                      }
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setSelectedFolder(folder.id)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <FolderIcon
                          size={16}
                          className="text-muted-foreground"
                        />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">
                            {folder.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {folder.count} items
                          </div>
                        </div>
                        {selectedFolder === folder.id && (
                          <CheckIcon size={16} className="text-primary" />
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // TODO: Implement create new folder functionality
                console.log("Create new folder");
              }}
            >
              <PlusIcon size={16} className="mr-2" />
              Create New Folder
            </Button>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAddToBookmark}
              disabled={!selectedFolder}
            >
              Add to Bookmarks
            </AlertDialogAction>
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
            <StarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Add to Bookmarks</span>
          </div>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <StarIcon size={20} />
            Add to Bookmarks
          </AlertDialogTitle>
          <AlertDialogDescription>
            Choose a folder to save this product to your bookmarks.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {product?.productName && (
            <div className="rounded-lg border p-3 bg-muted/50">
              <h4 className="font-medium text-sm">{product.productName}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Product ID: {product.productId}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Select Bookmark Folder
            </Label>
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a folder..." />
              </SelectTrigger>
              <SelectContent>
                {mockBookmarkFolders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    <div className="flex items-center gap-2 w-full">
                      <FolderIcon size={16} className="text-muted-foreground" />
                      <span className="flex-1">{folder.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {folder.count} items
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alternative: Show folders as clickable cards */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Or browse folders:</Label>
            <ScrollArea className="h-32 w-full rounded-md border p-2">
              <div className="space-y-2">
                {mockBookmarkFolders.map((folder) => (
                  <Button
                    key={folder.id}
                    variant={selectedFolder === folder.id ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setSelectedFolder(folder.id)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <FolderIcon size={16} className="text-muted-foreground" />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{folder.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {folder.count} items
                        </div>
                      </div>
                      {selectedFolder === folder.id && (
                        <CheckIcon size={16} className="text-primary" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // TODO: Implement create new folder functionality
              console.log("Create new folder");
            }}
          >
            <PlusIcon size={16} className="mr-2" />
            Create New Folder
          </Button>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAddToBookmark}
            disabled={!selectedFolder}
          >
            Add to Bookmarks
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
