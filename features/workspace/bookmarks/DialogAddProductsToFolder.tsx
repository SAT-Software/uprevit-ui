import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import {
  PiPlusCircleDuotone,
  PiFolderDuotone,
  PiPackageDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
        user_id: userId as string,
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
        <Button variant="default" size="sm" className="flex items-center gap-2">
          <PiPlusCircleDuotone className="w-5 h-5" />
          Add Products
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiPlusCircleDuotone className="w-5 h-5" />
              <p>Add Product to Folder</p>
            </div>
            <DialogClose asChild>
              <button
                type="button"
                className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              >
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Choose a product to add to this bookmark folder.
        </DialogDescription>

        <form
          id="add-products-form"
          className="p-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
        >
          <div className="space-y-4">
            {/* Folder Display */}
            <div className="rounded-lg border p-3 bg-muted/30">
              <div className="flex items-center gap-2">
                <PiFolderDuotone size={16} className="text-muted-foreground" />
                <h4 className="font-medium text-sm">{folderName}</h4>
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                {folderId}
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
                            <PiPackageDuotone
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span className="flex-1">
                              {product.product_name || "Unnamed Product"}
                            </span>
                            {product.status && (
                              <span className="text-xs text-muted-foreground ml-auto uppercase border border-border px-1.5 rounded-[4px]">
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
              <div className="rounded-lg border p-3 bg-primary/5 border-primary/20">
                <div className="flex items-center gap-2">
                  <PiPackageDuotone size={16} className="text-primary" />
                  <h4 className="font-semibold text-sm text-foreground">
                    {selectedProduct.product_name || "Unnamed Product"}
                  </h4>
                </div>
                {selectedProduct.product_plan_number && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Plan:{" "}
                    <span className="font-mono">
                      {selectedProduct.product_plan_number}
                    </span>
                  </p>
                )}
                {selectedProduct.status && (
                  <div className="mt-2 flex">
                    <span className="text-[10px] font-medium bg-background border px-1.5 py-0.5 rounded-sm shadow-sm uppercase">
                      {selectedProduct.status}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4 sm:justify-end">
          <DialogClose asChild>
            <Button variant="secondary" type="button" size="sm">
              <PiXCircleDuotone className="mr-2 w-4 h-4" />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            form="add-products-form"
          >
            {isPending ? (
              <PiPlusCircleDuotone className="animate-spin mr-2 w-4 h-4" />
            ) : (
              <PiPlusCircleDuotone className="mr-2 w-4 h-4" />
            )}
            {isPending ? "Bookmarking..." : "Bookmark Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
