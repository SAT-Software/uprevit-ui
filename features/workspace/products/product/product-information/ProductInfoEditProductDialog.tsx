"use client";

import { useId, useState } from "react";
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
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import {
  PiPencilCircleDuotone,
  PiCheckCircleDuotone,
  PiXCircleDuotone,
  PiCalendarBlankDuotone,
} from "react-icons/pi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ProductMetadata } from "@/types/product";

// Interface that matches the actual API response structure
interface ProductData {
  id?: string;
  product_name?: string;
  product_description?: string;
  target_date?: string;
  completion_date?: string;
  market_geography?: string;
  country_of_origin?: string;
  oem_contract_manufacturer?: string;
  commercial_clinical?: string;
  manufacturing_location?: string;
  product_information?: {
    market_geography?: string;
    country_of_origin?: string;
    oem_contract_manufacturer?: string;
    commercial_clinical?: string;
    manufacturing_location?: string;
  };
}

interface FormValues {
  productName: string;
  productDescription: string;
  targetDate: string;
  marketGeography: string;
  countryOfOrigin: string;
  oemContractManufacturer: string;
  commercialClinical: string;
  manufacturingLocation: string;
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
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

export default function EditProductDialog({
  product,
  productMetadata,
}: {
  product: ProductData;
  productMetadata: ProductMetadata;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const { mutate: updateProductTabData, isPending } = useUpdateProductTabData();
  const [openTargetDate, setOpenTargetDate] = useState(false);

  // Get current product information data - handle both possible data structures
  const initialValues = {
    productName: productMetadata?.product_name || "",
    productDescription: productMetadata?.product_description || "",
    targetDate: productMetadata?.target_date
      ? formatDateToLocal(new Date(productMetadata.target_date))
      : "",
    marketGeography: product?.market_geography || "",
    countryOfOrigin: product?.country_of_origin || "",
    oemContractManufacturer: product?.oem_contract_manufacturer || "",
    commercialClinical: product?.commercial_clinical || "",
    manufacturingLocation: product?.manufacturing_location || "",
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
    if (!product?.id) {
      console.error("Product ID is missing");
      return;
    }

    const updateData = {
      id: product.id,
      action: "update_product_information",
      tab: "product-information",
      data: {
        product_name: data.productName,
        product_description: data.productDescription,
        target_date: data.targetDate
          ? new Date(data.targetDate).toISOString()
          : null,
        market_geography: data.marketGeography,
        country_of_origin: data.countryOfOrigin,
        oem_contract_manufacturer: data.oemContractManufacturer,
        commercial_clinical: data.commercialClinical,
        manufacturing_location: data.manufacturingLocation,
      },
    };

    updateProductTabData(updateData, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
      onError: (error) => {
        console.error("Failed to update product information:", error);
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          disabled={
            productMetadata?.status === "submitted" &&
            productMetadata?.is_latest === false
          }
          className="flex items-center gap-2"
        >
          <PiPencilCircleDuotone className="w-4 h-4" />
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-4xl max-h-[90vh] [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Edit Product Information</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edit product details and information fields.
        </DialogDescription>
        <form
          id={`edit-product-info-form-${id}`}
          className="overflow-y-auto"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="p-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Column: Basic Info */}
              <div className="space-y-4">
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
                  <Popover
                    open={openTargetDate}
                    onOpenChange={setOpenTargetDate}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id={`${id}-target-date`}
                        className="h-9 w-full justify-between font-normal"
                        aria-invalid={errors.targetDate ? "true" : "false"}
                      >
                        {targetDateValue
                          ? parseDateStringAsLocal(
                              targetDateValue
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
                            setValue(
                              "targetDate",
                              formatDateToLocal(selectedDate)
                            );
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

              {/* Right Column: Additional Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-market-geography`} className="text-sm">
                    Market / Geography
                  </Label>
                  <Input
                    id={`${id}-market-geography`}
                    placeholder="Enter market/geography"
                    type="text"
                    aria-invalid={errors.marketGeography ? "true" : "false"}
                    {...register("marketGeography", {
                      required: "Market/Geography is required",
                    })}
                  />
                  {errors.marketGeography && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.marketGeography.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-country-origin`} className="text-sm">
                    Country of Origin
                  </Label>
                  <Input
                    id={`${id}-country-origin`}
                    placeholder="Enter country of origin"
                    type="text"
                    aria-invalid={errors.countryOfOrigin ? "true" : "false"}
                    {...register("countryOfOrigin", {
                      required: "Country of Origin is required",
                    })}
                  />
                  {errors.countryOfOrigin && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.countryOfOrigin.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-oem-contract`} className="text-sm">
                    OEM / Contract manufacturer
                  </Label>
                  <Input
                    id={`${id}-oem-contract`}
                    placeholder="Enter OEM/contract manufacturer"
                    type="text"
                    aria-invalid={
                      errors.oemContractManufacturer ? "true" : "false"
                    }
                    {...register("oemContractManufacturer", {
                      required: "OEM/Contract manufacturer is required",
                    })}
                  />
                  {errors.oemContractManufacturer && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.oemContractManufacturer.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`${id}-commercial-clinical`}
                    className="text-sm"
                  >
                    Commercial / Clinical
                  </Label>
                  <Input
                    id={`${id}-commercial-clinical`}
                    placeholder="Enter commercial/clinical"
                    type="text"
                    aria-invalid={errors.commercialClinical ? "true" : "false"}
                    {...register("commercialClinical", {
                      required: "Commercial/Clinical is required",
                    })}
                  />
                  {errors.commercialClinical && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.commercialClinical.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`${id}-manufacturing-location`}
                    className="text-sm"
                  >
                    Manufacturing Location
                  </Label>
                  <Input
                    id={`${id}-manufacturing-location`}
                    placeholder="Enter manufacturing location"
                    type="text"
                    aria-invalid={
                      errors.manufacturingLocation ? "true" : "false"
                    }
                    {...register("manufacturingLocation")}
                  />
                  {errors.manufacturingLocation && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.manufacturingLocation.message}
                    </p>
                  )}
                </div>
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
            form={`edit-product-info-form-${id}`}
            disabled={isPending}
            aria-busy={isPending}
            size="sm"
          >
            <PiCheckCircleDuotone />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
