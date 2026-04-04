import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import {
  PiPlusCircleDuotone,
  PiFolderDuotone,
  PiPackageDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import { PiCheckDuotone, PiCaretUpDownDuotone } from "react-icons/pi";

import { cn } from "@uprevit/ui/lib/utils";
import { Button } from "@uprevit/ui/components/ui/button";
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
import { Label } from "@uprevit/ui/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@uprevit/ui/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { useAddProductInBookmarkFolder } from "@/hooks/bookmark/useAddProductInBookmarkFolder";
import { Spinner } from "@uprevit/ui/components/ui/spinner";

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
  const [comboboxOpen, setComboboxOpen] = useState(false);

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
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="default"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-between"
                  >
                    {selectedProductId
                      ? products.find(
                          (product: { _id: string; product_name?: string }) =>
                            product._id === selectedProductId
                        )?.product_name || "Unnamed Product"
                      : "Choose a product..."}
                    <PiCaretUpDownDuotone className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search products..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        {isLoading
                          ? "Loading products..."
                          : error
                          ? "Error loading products"
                          : "No product found."}
                      </CommandEmpty>
                      <CommandGroup>
                        {products
                          ?.slice(0, 50)
                          .map(
                            (product: {
                              _id: string;
                              product_name?: string;
                              product_plan_number?: string;
                              status?: string;
                            }) => (
                              <CommandItem
                                key={product._id}
                                value={product.product_name || product._id}
                                onSelect={() => {
                                  setValue(
                                    "productId",
                                    product._id === selectedProductId
                                      ? ""
                                      : product._id
                                  );
                                  setComboboxOpen(false);
                                }}
                              >
                                <PiPackageDuotone
                                  size={16}
                                  className="mr-2 text-muted-foreground"
                                />
                                <span className="flex-1 truncate">
                                  {product.product_name || "Unnamed Product"}
                                </span>
                                {product.status && (
                                  <span className="text-xs text-muted-foreground ml-2 uppercase border border-border px-1.5 rounded-[4px]">
                                    {product.status}
                                  </span>
                                )}
                                <PiCheckDuotone
                                  className={cn(
                                    "ml-2 h-4 w-4",
                                    selectedProductId === product._id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            )
                          )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
              <Spinner />
            ) : (
              <PiPlusCircleDuotone className="mr-2 w-4 h-4" />
            )}
            {isPending ? "Adding..." : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
