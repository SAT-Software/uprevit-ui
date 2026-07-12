"use client";

import { useId, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
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
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { Textarea } from "@uprevit/ui/components/ui/textarea";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import {
  PiCheckCircleDuotone,
  PiXCircleDuotone,
  PiCalendarBlankDuotone,
} from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";
import { Calendar } from "@uprevit/ui/components/ui/calendar";
import type { ProductMetadata } from "@/types/product";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { PropertyEditIcon } from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";

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
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg max-h-[90vh] [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Edit Product Details</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edit product name, description, and target date.
        </DialogDescription>
        <form
          id={`edit-product-metadata-form-${id}`}
          className="overflow-y-auto"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-product-name`} className="text-sm">
                Product Name
              </Label>
              <Input
                id={`${id}-product-name`}
                placeholder="Enter product name"
                type="text"
                aria-invalid={errors.productName ? "true" : "false"}
                {...register("productName", {
                  required: "Product Name is required",
                })}
              />
              {errors.productName && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.productName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${id}-description`} className="text-sm">
                Description
              </Label>
              <Textarea
                id={`${id}-description`}
                placeholder="Enter product description"
                className="min-h-[100px]"
                aria-invalid={errors.productDescription ? "true" : "false"}
                {...register("productDescription")}
              />
              {errors.productDescription && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.productDescription.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${id}-target-date`} className="text-sm">
                Target Date
              </Label>
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
                    <PiCalendarBlankDuotone />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-60 overflow-hidden p-0 rounded-lg"
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
              {errors.targetDate && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.targetDate.message}
                </p>
              )}
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
            form={`edit-product-metadata-form-${id}`}
            disabled={isPending}
            aria-busy={isPending}
            size="sm"
          >
            {isPending ? <Spinner /> : <PiCheckCircleDuotone />}
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
