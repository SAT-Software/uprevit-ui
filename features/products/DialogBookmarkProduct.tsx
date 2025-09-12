import { StarIcon, FolderIcon } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";

import {
  AlertDialog,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllUserBookmarkFolders } from "@/hooks/bookmark/useGetAllUserBookmarkFolders";
import { useBookmarkProduct } from "@/hooks/product/useBookmarkProduct";

interface FormValues {
  folderId: string;
}

export default function DialogBookmarkProduct({
  open,
  onOpenChange,
  product,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  product?: {
    _id: string;
    product_name?: string;
  };
  children?: React.ReactNode;
}) {
  const { data, isLoading, error } = useGetAllUserBookmarkFolders();
  const bookmarkFolders = data?.bookmarked_product_folders ?? [];
  const bookmarkProduct = useBookmarkProduct();

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      folderId: "",
    },
    mode: "onSubmit",
  });

  const selectedFolderId = watch("folderId");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!product?._id) return;
    console.log(data);
    try {
      await bookmarkProduct.mutateAsync({
        id: product._id,
        folder_id: data.folderId,
      });
      console.log("success bookmark product");
      // Reset form and close dialog on success
      reset();
      onOpenChange?.(false);
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error("Failed to bookmark product:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when dialog closes
      reset();
    }
    onOpenChange?.(open);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            handleSubmit(onSubmit)(e); // Call our custom submit handler
          }}
        >
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
            {product?.product_name && (
              <div className="rounded-lg border p-3 bg-muted/50">
                <h4 className="font-medium text-sm">{product.product_name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Product ID: {product._id}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Select Bookmark Folder
              </Label>
              <Select
                value={selectedFolderId}
                onValueChange={(value) => setValue("folderId", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a folder..." />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem disabled value="loading">
                      Loading folders...
                    </SelectItem>
                  ) : error ? (
                    <SelectItem disabled value="error">
                      Error loading folders
                    </SelectItem>
                  ) : bookmarkFolders.length === 0 ? (
                    <SelectItem disabled value="empty">
                      No folders available
                    </SelectItem>
                  ) : (
                    bookmarkFolders?.map(
                      (folder: {
                        _id: string;
                        folder_name: string;
                        products: string[];
                      }) => (
                        <SelectItem key={folder._id} value={folder._id}>
                          <div className="flex items-center gap-2 w-full">
                            <FolderIcon
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="flex-1">{folder.folder_name}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {folder.products.length || 0} items
                            </span>
                          </div>
                        </SelectItem>
                      )
                    )
                  )}
                </SelectContent>
              </Select>
              {errors.folderId && (
                <p className="text-sm text-destructive">
                  {errors.folderId.message}
                </p>
              )}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <Button
              type="submit"
              disabled={!selectedFolderId || bookmarkProduct.isPending}
            >
              {bookmarkProduct.isPending ? "Adding..." : "Add to Bookmarks"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
