"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyIcon } from "lucide-react";
import { useId, useState } from "react";
import { useGetDepartmentById } from "@/hooks/department/useGetDepartmentById";
import { useGetProjectById } from "@/hooks/project/useGetProjectById";
import { Item } from "./ProductsPageProductTable";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateProduct } from "@/hooks/product/useCreateProduct";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";

export interface UpdateProductDialogProps {
  product: Item;
}

interface FormValues {
  ppn: string;
  productName: string;
  description: string;
  department: string;
  project: string;
  version: string;
  status: string;
}

export default function DialogDuplicateProduct({
  product,
}: UpdateProductDialogProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  const { data: department } = useGetDepartmentById(product.department_id);
  const { data: project } = useGetProjectById(product.project_id);
  const { data: allProductTabData } = useGetProductTabData(
    product._id,
    "all-tabs"
  );

  const createMutation = useCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      ppn: "",
      productName: product.product_name,
      description: product.description,
      department: product.department_id,
      project: product.project_id,
      version: "1.0",
      status: "draft",
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const productData = {
        product_plan_number: data.ppn,
        product_name: data.productName,
        product_description: data.description,
        department_id: product.department_id,
        project_id: product.project_id,
        master_version: data.version,
        status: data.status.toLowerCase(),
        product_information: allProductTabData.result.data.product_information,
        compliance_information:
          allProductTabData.result.data.compliance_information,
        label_components: allProductTabData.result.data.label_components,
        symbols_graphics: allProductTabData.result.data.symbols_graphics,
        product_data: allProductTabData.result.data.product_data,
        operational_parameters:
          allProductTabData.result.data.operational_parameters,
        label_tags: allProductTabData.result.data.label_tags,
      };

      await createMutation.mutateAsync(productData);

      reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="focus:bg-accent hover:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          key={product.productId}
        >
          <CopyIcon className=" h-4 w-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Duplicate Product
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Update product details
        </DialogDescription>
        <div className="overflow-y-auto">
          <div className="px-6 pt-4 pb-6">
            <form
              id="duplicate-product-form"
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor={`${id}-ppn`}>Product Plan Number (PPN)</Label>
                <Input
                  id={`${id}-ppn`}
                  placeholder="Enter PPN"
                  type="text"
                  {...register("ppn", {
                    required: "PPN is required",
                    minLength: {
                      value: 10,
                      message:
                        "PPN must be at least 10 alphanumeric characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9]/,
                      message:
                        "PPN must be at least 10 alphanumeric characters",
                    },
                  })}
                />
                {errors.ppn && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.ppn.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-product-name`}>Product Name</Label>
                <Input
                  id={`${id}-product-name`}
                  placeholder="Enter product name"
                  type="text"
                  {...register("productName", {
                    required: "Product name is required",
                  })}
                />
                {errors.productName && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.productName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-description`}>Description</Label>
                <Textarea
                  id={`${id}-description`}
                  placeholder="Enter product description"
                  className="min-h-[100px] resize-none"
                  {...register("description", {
                    maxLength: {
                      value: 220,
                      message: "Description must be at most 220 characters",
                    },
                  })}
                />
                {errors.description && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-department`}>Department</Label>
                  <Input
                    id={`${id}-department`}
                    value={department?.department?.department_name}
                    disabled
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-project`}>Project</Label>
                  <Input
                    id={`${id}-project`}
                    value={project?.project?.project_name}
                    disabled
                    type="text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-version`}>Version</Label>
                  <Input
                    id={`${id}-version`}
                    value="1.0"
                    type="text"
                    disabled
                    className="bg-muted"
                    {...register("version")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-status`}>Status</Label>
                  <Input
                    id={`${id}-status`}
                    value="Draft"
                    type="text"
                    disabled
                    className="bg-muted"
                    {...register("status")}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="duplicate-product-form">
            Update Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
