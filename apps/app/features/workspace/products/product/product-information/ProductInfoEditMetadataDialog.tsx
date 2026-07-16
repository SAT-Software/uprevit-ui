"use client";

import { useId, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@uprevit/ui/components/ui/input-group";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";
import { Calendar } from "@uprevit/ui/components/ui/calendar";
import type { ProductMetadata } from "@/types/product";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Calendar03Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  PropertyEditIcon,
} from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";

interface FormValues {
  productName: string;
  productDescription: string;
  targetDate: string;
}

function formatDateToLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateStringAsLocal(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function ProductInfoEditMetadataDialog({
  productId,
  productMetadata,
}: {
  productId: string;
  productMetadata: ProductMetadata;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [openTargetDate, setOpenTargetDate] = useState(false);
  const { mutate: updateProductTabData, isPending } = useUpdateProductTabData();
  const isSubmitted = productMetadata?.status === "submitted";

  const initialValues: FormValues = {
    productName: productMetadata?.product_name || "",
    productDescription: productMetadata?.product_description || "",
    targetDate: productMetadata?.target_date
      ? formatDateToLocal(new Date(productMetadata.target_date))
      : "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: initialValues,
    values: initialValues,
    mode: "onSubmit",
  });

  const targetDateValue = watch("targetDate");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (isSubmitted) return;

    const updateData = {
      id: productId,
      action: "update_product_information",
      tab: "product-information",
      data: {
        product_name: data.productName,
        product_description: data.productDescription,
        target_date: data.targetDate
          ? new Date(data.targetDate).toISOString()
          : null,
      },
    };

    updateProductTabData(updateData, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
      onError: (error) => {
        console.error("Failed to update product metadata:", error);
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" disabled={isSubmitted}>
                <Icon icon={PropertyEditIcon} /> Update
              </Button>
            </DialogTrigger>
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isSubmitted
            ? "Submitted products can't be edited"
            : "Edit product name, description, and target date"}
        </TooltipContent>
      </Tooltip>
      <AppDialogContent
        title="Edit Product Details"
        description="Edit product name, description, and target date."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Save Changes",
          loadingLabel: "Saving...",
          form: `edit-product-metadata-form-${id}`,
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
          id={`edit-product-metadata-form-${id}`}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-4 p-4">
            <Field data-invalid={!!errors.productName}>
              <FormFieldLabel
                htmlFor={`${id}-product-name`}
                label="Product Name"
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-product-name`}
                  placeholder="Enter product name"
                  type="text"
                  aria-invalid={errors.productName ? "true" : "false"}
                  {...register("productName", {
                    required: "Product Name is required",
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.productName]} />
            </Field>

            <Field data-invalid={!!errors.productDescription}>
              <FormFieldLabel
                htmlFor={`${id}-description`}
                label="Description"
                optional
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupTextarea
                  id={`${id}-description`}
                  placeholder="Enter product description"
                  className="min-h-[100px]"
                  aria-invalid={errors.productDescription ? "true" : "false"}
                  {...register("productDescription")}
                />
              </InputGroup>
              <FieldError errors={[errors.productDescription]} />
            </Field>

            <Field data-invalid={!!errors.targetDate}>
              <FormFieldLabel
                htmlFor={`${id}-target-date`}
                label="Target Date"
                optional
              />
              <Popover open={openTargetDate} onOpenChange={setOpenTargetDate}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id={`${id}-target-date`}
                    className="h-9 w-full justify-between font-normal"
                    aria-invalid={errors.targetDate ? "true" : "false"}
                  >
                    {targetDateValue
                      ? parseDateStringAsLocal(
                          targetDateValue,
                        ).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Select target date"}
                    <Icon icon={Calendar03Icon} size={16} strokeWidth={2} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-60 overflow-hidden rounded-lg p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={
                      targetDateValue
                        ? parseDateStringAsLocal(targetDateValue)
                        : undefined
                    }
                    captionLayout="dropdown"
                    startMonth={new Date(new Date().getFullYear() - 50, 0)}
                    endMonth={new Date(new Date().getFullYear() + 50, 11)}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setValue("targetDate", formatDateToLocal(selectedDate));
                      }
                      setOpenTargetDate(false);
                    }}
                    className="w-full"
                  />
                </PopoverContent>
              </Popover>
              <FieldError errors={[errors.targetDate]} />
            </Field>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}
