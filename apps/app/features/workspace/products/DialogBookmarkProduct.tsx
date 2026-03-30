import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "react-oidc-context";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { useGetAllUserBookmarkFolders } from "@/hooks/bookmark/useGetAllUserBookmarkFolders";
import { useBookmarkProduct } from "@/hooks/product/useBookmarkProduct";
import {
  PiBookmarkSimpleDuotone,
  PiFolderDuotone,
  PiXCircleDuotone,
  PiCheckCircleDuotone,
} from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";

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
  const bookmarkFolders = data?.result?.bookmarked_product_folders ?? [];
  const bookmarkProduct = useBookmarkProduct();
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;

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
    try {
      await bookmarkProduct.mutateAsync({
        user_id: userId as string,
        product_id: product._id,
        folder_id: data.folderId,
      });
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

  const dialogContent = (
    <>
      <DialogHeader className="contents space-y-0 text-left">
        <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
          <p>Add to Bookmarks</p>
          <DialogClose asChild>
            <button type="button" className="cursor-pointer">
              <PiXCircleDuotone size={18} />
            </button>
          </DialogClose>
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className="sr-only">
        Choose a folder to save this product to your bookmarks.
      </DialogDescription>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}
      >
        <div className="p-4 space-y-4">
          {product?.product_name && (
            <div className="rounded-lg border p-3 bg-muted/50">
              <h4 className="font-medium text-sm">{product.product_name}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Product ID: {product._id}
              </p>
            </div>
          )}

          <div className="space-y-2">
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
                          <PiFolderDuotone
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

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            size="sm"
            variant="default"
            disabled={!selectedFolderId || bookmarkProduct.isPending}
          >
            {bookmarkProduct.isPending ? <Spinner /> : <PiCheckCircleDuotone />}
            {bookmarkProduct.isPending ? "Adding..." : "Add to Bookmarks"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md [&>button:last-child]:top-3.5">
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}
