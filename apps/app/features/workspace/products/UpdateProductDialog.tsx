"use client";

import { useId, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@uprevit/ui/components/ui/input-group";
import { ProductListItem } from "./productListItem";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";

export default function UpdateProductDialog({
  product,
  open,
  onOpenChange,
}: {
  product: ProductListItem;
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
      <AppDialogContent
        title="Update Product"
        description="Update product details."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Update Product",
          loadingLabel: "Updating...",
          form: `update-product-form-${id}`,
          type: "submit",
          loading: isPending,
          disabled: isPending,
          icon: CheckmarkCircle01Icon,
        }}
        secondaryAction={{
          label: "Cancel",
          icon: Cancel01Icon,
        }}
      >
        <form
          id={`update-product-form-${id}`}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-4 p-4">
            <Field>
              <FormFieldLabel
                htmlFor={`${id}-ppn`}
                label="Product Plan Number (PPN)"
                tooltip="The unique identifier for this product. This cannot be changed."
              />
              <InputGroup size="md" className="bg-muted">
                <InputGroupInput
                  id={`${id}-ppn`}
                  defaultValue={product.product_plan_number || ""}
                  type="text"
                  disabled
                />
              </InputGroup>
            </Field>

            <Field data-invalid={!!errors.product_name}>
              <FormFieldLabel
                htmlFor={`${id}-product-name`}
                label="Product Name"
                tooltip="The display name shown across the workspace for this product."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-product-name`}
                  placeholder="Enter product name"
                  type="text"
                  aria-invalid={errors.product_name ? "true" : "false"}
                  {...register("product_name", {
                    required: "Product name is required",
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.product_name]} />
            </Field>

            <Field>
              <FormFieldLabel
                htmlFor={`${id}-description`}
                label="Description"
                tooltip="A short summary of the product's purpose and details."
                optional
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupTextarea
                  id={`${id}-description`}
                  placeholder="Enter product description"
                  className="min-h-24 resize-none"
                  aria-invalid={errors.product_description ? "true" : "false"}
                  {...register("product_description")}
                />
              </InputGroup>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FormFieldLabel
                  htmlFor={`${id}-department`}
                  label="Department"
                  tooltip="The department this product belongs to."
                />
                <InputGroup size="md" className="bg-muted">
                  <InputGroupInput
                    id={`${id}-department`}
                    defaultValue={
                      product.department?.[0]?.department_name ??
                      product.department_id
                    }
                    type="text"
                    disabled
                  />
                </InputGroup>
              </Field>

              <Field>
                <FormFieldLabel
                  htmlFor={`${id}-project`}
                  label="Project"
                  tooltip="The project this product belongs to."
                />
                <InputGroup size="md" className="bg-muted">
                  <InputGroupInput
                    id={`${id}-project`}
                    defaultValue={
                      product.project?.[0]?.project_name ?? product.project_id
                    }
                    type="text"
                    disabled
                  />
                </InputGroup>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FormFieldLabel
                  htmlFor={`${id}-version`}
                  label="Version"
                  tooltip="The current version of this product."
                />
                <InputGroup size="md" className="bg-muted">
                  <InputGroupInput
                    id={`${id}-version`}
                    defaultValue={String(product.version ?? "")}
                    type="text"
                    disabled
                  />
                </InputGroup>
              </Field>

              <Field>
                <FormFieldLabel
                  htmlFor={`${id}-status`}
                  label="Status"
                  tooltip="The current workflow status of this product."
                />
                <InputGroup size="md" className="bg-muted">
                  <InputGroupInput
                    id={`${id}-status`}
                    defaultValue={product.status?.toLowerCase() ?? ""}
                    type="text"
                    disabled
                  />
                </InputGroup>
              </Field>
            </div>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}
