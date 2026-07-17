"use client";

import { useId, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "react-oidc-context";

import { cn } from "@uprevit/ui/lib/utils";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldGroup } from "@uprevit/ui/components/ui/field";
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
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  Folder02Icon,
  PackageIcon,
  PropertyAddIcon,
  Tick01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
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
  const formId = useId();
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
    }) => product._id === selectedProductId,
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
        onError: (submitError) => {
          reset();
          setOpen(false);
          console.error("Failed to add product to folder:", submitError);
        },
      },
    );
  };

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
      setComboboxOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Icon icon={PropertyAddIcon} />
          Add Products
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Add Product to Folder"
        description="Choose a product to add to this bookmark folder."
        variant="form"
        size="md"
        primaryAction={{
          label: "Add Product",
          loadingLabel: "Adding...",
          form: formId,
          type: "submit",
          loading: isPending,
          disabled: isPending,
          icon: PropertyAddIcon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      >
        <form
          id={formId}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-4 p-4">
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center gap-2">
                <Icon
                  icon={Folder02Icon}
                  size={16}
                  className="text-muted-foreground"
                />
                <h4 className="text-sm font-medium">{folderName}</h4>
              </div>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {folderId}
              </p>
            </div>

            <Field>
              <FormFieldLabel
                label="Select Product"
                tooltip="Choose a product to add to this bookmark folder."
              />
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
                            product._id === selectedProductId,
                        )?.product_name || "Unnamed Product"
                      : "Choose a product..."}
                    <Icon
                      icon={UnfoldMoreIcon}
                      size={16}
                      className="ml-2 shrink-0 opacity-50"
                    />
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
                                      : product._id,
                                  );
                                  setComboboxOpen(false);
                                }}
                              >
                                <Icon
                                  icon={PackageIcon}
                                  size={16}
                                  className="mr-2 text-muted-foreground"
                                />
                                <span className="flex-1 truncate">
                                  {product.product_name || "Unnamed Product"}
                                </span>
                                {product.status ? (
                                  <span className="ml-2 rounded-[4px] border border-border px-1.5 text-xs uppercase text-muted-foreground">
                                    {product.status}
                                  </span>
                                ) : null}
                                <Icon
                                  icon={Tick01Icon}
                                  size={16}
                                  className={cn(
                                    "ml-2",
                                    selectedProductId === product._id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ),
                          )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.productId ? (
                <p className="text-sm text-destructive">
                  {errors.productId.message}
                </p>
              ) : null}
            </Field>

            {selectedProduct ? (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <Icon icon={PackageIcon} size={16} className="text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">
                    {selectedProduct.product_name || "Unnamed Product"}
                  </h4>
                </div>
                {selectedProduct.product_plan_number ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Plan:{" "}
                    <span className="font-mono">
                      {selectedProduct.product_plan_number}
                    </span>
                  </p>
                ) : null}
                {selectedProduct.status ? (
                  <div className="mt-2 flex">
                    <span className="rounded-sm border bg-background px-1.5 py-0.5 text-[10px] font-medium uppercase shadow-sm">
                      {selectedProduct.status}
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}
