"use client";

import { useId } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "react-oidc-context";

import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import { useGetAllUserBookmarkFolders } from "@/hooks/bookmark/useGetAllUserBookmarkFolders";
import { useBookmarkProduct } from "@/hooks/product/useBookmarkProduct";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Folder02Icon,
} from "@hugeicons/core-free-icons";

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
  const id = useId();
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

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedFolderId = watch("folderId");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!product?._id) return;
    try {
      await bookmarkProduct.mutateAsync({
        user_id: userId as string,
        product_id: product._id,
        folder_id: data.folderId,
      });
      reset();
      onOpenChange?.(false);
    } catch (error) {
      console.error("Failed to bookmark product:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange?.(open);
  };

  const dialogContent = (
    <AppDialogContent
      title="Add to Bookmarks"
      description="Choose a folder to save this product to your bookmarks."
      variant="form"
      size="md"
      primaryAction={{
        label: "Add to Bookmarks",
        loadingLabel: "Adding...",
        form: `bookmark-product-form-${id}`,
        type: "submit",
        loading: bookmarkProduct.isPending,
        disabled: !selectedFolderId || bookmarkProduct.isPending,
        icon: CheckmarkCircle01Icon,
      }}
      secondaryAction={{
        label: "Cancel",
        icon: Cancel01Icon,
      }}
    >
      <form
        id={`bookmark-product-form-${id}`}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <FieldGroup className="gap-4 p-4">
          {product?.product_name ? (
            <div className="rounded-lg border bg-muted/50 p-3">
              <h4 className="text-sm font-medium">{product.product_name}</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Product ID: {product._id}
              </p>
            </div>
          ) : null}

          <Field data-invalid={!!errors.folderId}>
            <FormFieldLabel
              htmlFor={`${id}-folder`}
              label="Select Bookmark Folder"
              tooltip="Choose a folder to organize this bookmarked product."
            />
            <Select
              value={selectedFolderId}
              onValueChange={(value) => setValue("folderId", value)}
            >
              <SelectTrigger
                id={`${id}-folder`}
                size="md"
                className="w-full bg-background"
              >
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
                        <div className="flex w-full items-center gap-2">
                          <Icon
                            icon={Folder02Icon}
                            size={16}
                            className="text-muted-foreground"
                          />
                          <span className="flex-1">{folder.folder_name}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {folder.products.length || 0} items
                          </span>
                        </div>
                      </SelectItem>
                    ),
                  )
                )}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </form>
    </AppDialogContent>
  );

  if (open !== undefined && onOpenChange !== undefined) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      {dialogContent}
    </Dialog>
  );
}
