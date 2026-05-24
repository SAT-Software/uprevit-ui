"use client";

import { useId, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@uprevit/ui/components/ui/dialog";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { Textarea } from "@uprevit/ui/components/ui/textarea";
import { Item } from "./ProductsPageProductTable";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import { PiXCircleDuotone, PiCheckCircleDuotone } from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";

export default function UpdateProductDialog({
  product,
  open,
  onOpenChange,
}: {
  product: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const id = useId();
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  type FormValues = {
    product_name: string;
    product_description: string;
  };

  const initialValues = useMemo(
    () => ({
      product_name: product.product_name || "",
      product_description: product.product_description || "",
    }),
    [product],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: initialValues,
    mode: "onSubmit",
    values: initialValues,
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    updateProduct(
      {
        _id: product._id,
        action: "update-product",
        data: {
          _id: product._id,
          product_name: data.product_name,
          product_description: data.product_description,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
        onError: () => {
          onOpenChange(false);
          reset();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Update Product</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Update product details.
        </DialogDescription>
        <form
          id={`update-product-form-${id}`}
          className="overflow-y-auto"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-ppn`}>Product Plan Number (PPN)</Label>
              <Input
                id={`${id}-ppn`}
                defaultValue={product.product_plan_number || ""}
                type="text"
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${id}-product-name`}>Product Name</Label>
              <div className="flex flex-col gap-2">
                <Input
                  id={`${id}-product-name`}
                  placeholder="Enter product name"
                  type="text"
                  aria-invalid={errors.product_name ? "true" : "false"}
                  {...register("product_name", {
                    required: "Product name is required",
                  })}
                />
                {errors.product_name && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.product_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${id}-description`}>Description</Label>
              <Textarea
                id={`${id}-description`}
                placeholder="Enter product description"
                className="min-h-[100px] resize-none"
                aria-invalid={errors.product_description ? "true" : "false"}
                {...register("product_description")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-department`}>Department</Label>
                <Input
                  id={`${id}-department`}
                  defaultValue={
                    product.department?.[0]?.department_name ??
                    product.department_id
                  }
                  type="text"
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-project`}>Project</Label>
                <Input
                  id={`${id}-project`}
                  defaultValue={
                    product.project?.[0]?.project_name ?? product.project_id
                  }
                  type="text"
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-version`}>Version</Label>
                <Input
                  id={`${id}-version`}
                  defaultValue={String(product.version ?? "")}
                  type="text"
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-status`}>Status</Label>
                <Input
                  id={`${id}-status`}
                  defaultValue={product.status?.toLowerCase() ?? ""}
                  type="text"
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </div>
        </form>
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
            form={`update-product-form-${id}`}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? <Spinner /> : <PiCheckCircleDuotone />}
            {isPending ? "Updating..." : "Update Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
