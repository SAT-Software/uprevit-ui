import { PlusIcon, PackageIcon } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

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
import { useAddSourceFilesFolder } from "@/hooks/source-files/useAddSourceFilesFolder";

interface FormValues {
  productId: string;
}

interface DialogAddProductFolderProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export default function DialogAddProductFolder({
  open,
  onOpenChange,
  children,
}: DialogAddProductFolderProps) {
  const { data: productsData, isLoading, error } = useGetAllProducts();
  const products = productsData?.result?.products ?? [];
  const addSourceFilesFolder = useAddSourceFilesFolder();
  const [internalOpen, setInternalOpen] = useState(false);

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
    if (!data.productId) return;

    const product = products.find(
      (p: { _id: string; product_name?: string }) => p._id === data.productId
    );
    if (!product) return;

    try {
      await addSourceFilesFolder.mutateAsync({
        product_id: data.productId,
        name: product.product_name || "Unnamed Product",
      });

      console.log("Successfully added product to source files folder");
      // Reset form and close dialog on success
      reset();
      if (onOpenChange) {
        onOpenChange(false);
      } else {
        setInternalOpen(false);
      }
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error("Failed to add product to source files folder:", error);
    }
  };

  // If external state control is provided, use controlled mode
  if (open !== undefined && onOpenChange !== undefined) {
    return (
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          onOpenChange(newOpen);
          if (!newOpen) reset();
        }}
      >
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PlusIcon size={20} />
                Add Product to Source Files
              </DialogTitle>
              <DialogDescription>
                Choose a product to add to your source files folder.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
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
                onClick={() => onOpenChange?.(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedProductId || addSourceFilesFolder.isPending}
              >
                {addSourceFilesFolder.isPending
                  ? "Adding..."
                  : "Add to Source Files"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Original trigger-based mode
  return (
    <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="default" className="flex items-center gap-2">
            <PlusIcon size={16} />
            Add Product Folder
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusIcon size={20} />
              Add Product to Source Files
            </DialogTitle>
            <DialogDescription>
              Choose a product to add to your source files folder.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
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
              onClick={() => setInternalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedProductId || addSourceFilesFolder.isPending}
            >
              {addSourceFilesFolder.isPending
                ? "Adding..."
                : "Add to Source Files"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
