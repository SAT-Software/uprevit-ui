"use client";

import { useId, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon } from "lucide-react";
import { Item } from "./ProductsPageProductTable";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { useUpdateProduct } from "@/hooks/product/useUpdateproduct";
import { Product } from "@/types/product";

export interface UpdateProductDialogProps {
  product: Item;
}

export default function UpdateProductDialog({
  product: productData,
}: UpdateProductDialogProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const { data: productsData } = useGetAllProducts();
  const products = productsData?.result?.products ?? [];
  const product = products.find((p: Product) => p._id === productData._id);
  const updateMutation = useUpdateProduct();

  type FormValues = {
    product_name: string;
    product_description: string;
  };

  const initialValues: FormValues = useMemo(
    () => ({
      product_name: product?.product_name || "",
      product_description: product?.product_description || "",
    }),
    [product]
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
    try {
      if (!product?._id) throw new Error("Product id missing for update");

      const updatedProduct: Product = {
        ...product,
        action: "update-product",
        data: {
          _id: product._id,
          name: data.product_name,
          product_description: data.product_description,
        },
      };

      await updateMutation.mutateAsync(updatedProduct);
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="focus:bg-accent hover:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          key={product._id}
        >
          <PencilIcon className=" h-4 w-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Update Product
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
          <div className="px-6 pt-4 pb-6">
            <div className="space-y-2">
              <Label htmlFor={`${id}-ppn`}>Product Plan Number (PPN)</Label>
              <Input
                id={`${id}-ppn`}
                value={product.product_plan_number}
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
                  value={product.department_id}
                  type="text"
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-project`}>Project</Label>
                <Input
                  id={`${id}-project`}
                  value={product.project_id}
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
                  value={product.master_version}
                  type="text"
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-status`}>Status</Label>
                <Input
                  id={`${id}-status`}
                  value={product.status.toLowerCase()}
                  type="text"
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </div>
        </form>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form={`update-product-form-${id}`}
            disabled={updateMutation.isPending}
            aria-busy={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Updating..." : "Update Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
