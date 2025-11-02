import { PlusIcon, FolderIcon, PackageIcon } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { useAddProductInBookmarkFolder } from "@/hooks/bookmark/useAddProductInBookmarkFolder";
import { useState } from "react";

interface FormValues {
  productId: string;
}

interface DialogAddProductsToFolderProps {
  folderName: string;
  folderId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export default function DialogAddProductsToFolder({
  folderName,
  folderId,
}: DialogAddProductsToFolderProps) {
  const { data: productsData, isLoading, error } = useGetAllProducts();
  const products = productsData?.result?.products ?? [];
  const [open, setOpen] = useState(false);

  const { mutate: addProductToFolder, isPending } =
    useAddProductInBookmarkFolder();

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      productId: "",
    },
    mode: "onSubmit",
  });

  const selectedProductId = watch("productId");
  const selectedProduct = products.find(
    (product: {
      _id: string;
      product_name?: string;
      product_plan_number?: string;
      status?: string;
    }) => product._id === selectedProductId
  );

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    addProductToFolder(
      {
        user_id: "68d2b37127794dcb43a32425",
        product_id: data.productId,
        folder_id: folderId,
      },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
        onError: (error) => {
          reset();
          setOpen(false);
          console.error("Failed to add product to folder:", error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <PlusIcon size={16} />
          Add Products
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent default form submission
            handleSubmit(onSubmit)(e); // Call our custom submit handler
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusIcon size={20} />
              Add Product to Folder
            </DialogTitle>
            <DialogDescription>
              Choose a product to add to this bookmark folder.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Folder Display */}
            <div className="rounded-lg border p-3 bg-muted/50">
              <div className="flex items-center gap-2">
                <FolderIcon size={16} className="text-muted-foreground" />
                <h4 className="font-medium text-sm">{folderName}</h4>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Folder ID: {folderId}
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Product</Label>
              <Select
                value={selectedProductId}
                onValueChange={(value) => setValue("productId", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a product..." />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem disabled value="loading">
                      Loading products...
                    </SelectItem>
                  ) : error ? (
                    <SelectItem disabled value="error">
                      Error loading products
                    </SelectItem>
                  ) : products.length === 0 ? (
                    <SelectItem disabled value="empty">
                      No products available
                    </SelectItem>
                  ) : (
                    products?.map(
                      (product: {
                        _id: string;
                        product_name?: string;
                        product_plan_number?: string;
                        status?: string;
                      }) => (
                        <SelectItem key={product._id} value={product._id}>
                          <div className="flex items-center gap-2 w-full">
                            <PackageIcon
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="flex-1">
                              {product.product_name || "Unnamed Product"}
                            </span>
                            {product.status && (
                              <span className="text-xs text-muted-foreground ml-auto">
                                {product.status}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      )
                    )
                  )}
                </SelectContent>
              </Select>
              {errors.productId && (
                <p className="text-sm text-destructive">
                  {errors.productId.message}
                </p>
              )}
            </div>

            {/* Selected Product Preview */}
            {selectedProduct && (
              <div className="rounded-lg border p-3 bg-primary/5">
                <div className="flex items-center gap-2">
                  <PackageIcon size={16} className="text-primary" />
                  <h4 className="font-medium text-sm">
                    {selectedProduct.product_name || "Unnamed Product"}
                  </h4>
                </div>
                {selectedProduct.product_plan_number && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Plan: {selectedProduct.product_plan_number}
                  </p>
                )}
                {selectedProduct.status && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Status: {selectedProduct.status}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Bookmarking..." : "Bookmark Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
