"use client";

import { useId, useState } from "react";
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
  DialogTrigger,
} from "@uprevit/ui/components/ui/dialog";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { Textarea } from "@uprevit/ui/components/ui/textarea";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import {
  PiPencilCircleDuotone,
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
import { ProductMetadata } from "@/types/product";
import { GEO_MARKETS } from "@/data/geo-markets";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@uprevit/ui/components/ui/command";
import { cn } from "@uprevit/ui/lib/utils";
import { PiCheck, PiCaretUpDown } from "react-icons/pi";
import { COUNTRIES } from "@/data/countries";
import * as Flags from "country-flag-icons/react/3x2";

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
  marketGeographySelect: string;
  marketGeographyInput: string;
  countryOfOriginSelect: string;
  countryOfOriginInput: string;
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
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [countryComboboxOpen, setCountryComboboxOpen] = useState(false);
  const { mutate: updateProductTabData, isPending } = useUpdateProductTabData();
  const [openTargetDate, setOpenTargetDate] = useState(false);
  const isSubmitted = productMetadata?.status === "submitted";

  // Get current product information data - handle both possible data structures
  const initialValues = {
    productName: productMetadata?.product_name || "",
    productDescription: productMetadata?.product_description || "",
    targetDate: productMetadata?.target_date
      ? formatDateToLocal(new Date(productMetadata.target_date))
      : "",
    marketGeographySelect:
      product?.market_geography &&
      GEO_MARKETS.some((m) => m.regionAcronym === product.market_geography)
        ? product.market_geography
        : "",
    marketGeographyInput:
      product?.market_geography &&
      !GEO_MARKETS.some((m) => m.regionAcronym === product.market_geography)
        ? product.market_geography
        : "",
    countryOfOriginSelect:
      product?.country_of_origin &&
      COUNTRIES.some((c) => c.name === product.country_of_origin)
        ? product.country_of_origin
        : "",
    countryOfOriginInput:
      product?.country_of_origin &&
      !COUNTRIES.some((c) => c.name === product.country_of_origin)
        ? product.country_of_origin
        : "",
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
  const marketGeographySelect = watch("marketGeographySelect");
  const marketGeographyInput = watch("marketGeographyInput");
  const countryOfOriginSelect = watch("countryOfOriginSelect");
  const countryOfOriginInput = watch("countryOfOriginInput");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (isSubmitted) {
      return;
    }

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
        market_geography:
          data.marketGeographySelect || data.marketGeographyInput,
        country_of_origin:
          data.countryOfOriginSelect || data.countryOfOriginInput,
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
          disabled={isSubmitted}
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
                  <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        role="combobox"
                        aria-expanded={comboboxOpen}
                        className="w-full justify-between text-foreground/80 font-normal h-9"
                        disabled={!!marketGeographyInput}
                      >
                        {marketGeographySelect
                          ? GEO_MARKETS.find(
                              (market) =>
                                market.regionAcronym === marketGeographySelect
                            )?.regionAcronym
                          : "Select market..."}
                        <PiCaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] p-0"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <Command>
                        <CommandInput placeholder="Search market..." />
                        <CommandList className="max-h-60 overflow-y-auto">
                          <CommandEmpty>No market found.</CommandEmpty>
                          <CommandGroup>
                            {GEO_MARKETS.map((market) => (
                              <CommandItem
                                key={market.regionAcronym}
                                value={market.regionAcronym}
                                onSelect={(currentValue) => {
                                  // The value comes lowercased from CommandItem, so we need to find the original casing
                                  const originalValue = GEO_MARKETS.find(
                                    (m) =>
                                      m.regionAcronym.toLowerCase() ===
                                      currentValue.toLowerCase()
                                  )?.regionAcronym;

                                  if (originalValue) {
                                    setValue(
                                      "marketGeographySelect",
                                      originalValue === marketGeographySelect
                                        ? ""
                                        : originalValue,
                                      { shouldValidate: true }
                                    );
                                    setComboboxOpen(false);
                                  }
                                }}
                              >
                                <PiCheck
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    marketGeographySelect ===
                                      market.regionAcronym
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {market.regionAcronym} - {market.fullName}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <div className="flex items-center gap-2 py-1">
                    <div className="h-0 w-full border-t border-dashed" />
                    <p className="text-[10px] font-light text-muted-foreground uppercase">
                      OR
                    </p>
                    <div className="h-0 w-full border-t border-dashed" />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`${id}-market-geography-custom`}
                      className="text-sm"
                    >
                      Enter Custom Market
                    </Label>
                    <Input
                      id={`${id}-market-geography-custom`}
                      placeholder="Enter custom market/geography"
                      type="text"
                      disabled={!!marketGeographySelect}
                      {...register("marketGeographyInput", {
                        validate: (value) => {
                          const selectValue = watch("marketGeographySelect");
                          if (!value && !selectValue) {
                            return "Market/Geography is required";
                          }
                          return true;
                        },
                      })}
                    />
                    {(errors.marketGeographySelect ||
                      errors.marketGeographyInput) && (
                      <p role="alert" className="text-xs text-destructive">
                        Market/Geography is required
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-country-origin`} className="text-sm">
                    Country of Origin
                  </Label>
                  <Popover
                    open={countryComboboxOpen}
                    onOpenChange={setCountryComboboxOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        role="combobox"
                        aria-expanded={countryComboboxOpen}
                        className="w-full justify-between text-foreground/80 font-normal h-9"
                        disabled={!!countryOfOriginInput}
                      >
                        {countryOfOriginSelect ? (
                          <span className="flex items-center gap-2">
                            {(() => {
                              const country = COUNTRIES.find(
                                (c) => c.name === countryOfOriginSelect
                              );
                              if (country) {
                                const FlagComponent =
                                  Flags[country.code as keyof typeof Flags];
                                return FlagComponent ? (
                                  <FlagComponent className="h-3 w-4 rounded-sm" />
                                ) : null;
                              }
                              return null;
                            })()}
                            {countryOfOriginSelect}
                          </span>
                        ) : (
                          "Select country..."
                        )}
                        <PiCaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] p-0"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <Command>
                        <CommandInput placeholder="Search country..." />
                        <CommandList className="max-h-60 overflow-y-auto">
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup>
                            {COUNTRIES.map((country) => {
                              const FlagComponent =
                                Flags[country.code as keyof typeof Flags];
                              return (
                                <CommandItem
                                  key={country.code}
                                  value={country.name}
                                  onSelect={(currentValue) => {
                                    const originalValue = COUNTRIES.find(
                                      (c) =>
                                        c.name.toLowerCase() ===
                                        currentValue.toLowerCase()
                                    )?.name;

                                    if (originalValue) {
                                      setValue(
                                        "countryOfOriginSelect",
                                        originalValue === countryOfOriginSelect
                                          ? ""
                                          : originalValue,
                                        { shouldValidate: true }
                                      );
                                      setCountryComboboxOpen(false);
                                    }
                                  }}
                                >
                                  <PiCheck
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      countryOfOriginSelect === country.name
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {FlagComponent && (
                                    <FlagComponent className="mr-2 h-3 w-4 rounded-sm" />
                                  )}
                                  {country.name} ({country.code})
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <div className="flex items-center gap-2 py-1">
                    <div className="h-0 w-full border-t border-dashed" />
                    <p className="text-[10px] font-light text-muted-foreground uppercase">
                      OR
                    </p>
                    <div className="h-0 w-full border-t border-dashed" />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`${id}-country-origin-custom`}
                      className="text-sm"
                    >
                      Enter Custom Country
                    </Label>
                    <Input
                      id={`${id}-country-origin-custom`}
                      placeholder="Enter custom country of origin"
                      type="text"
                      disabled={!!countryOfOriginSelect}
                      {...register("countryOfOriginInput", {
                        validate: (value) => {
                          const selectValue = watch("countryOfOriginSelect");
                          if (!value && !selectValue) {
                            return "Country of Origin is required";
                          }
                          return true;
                        },
                      })}
                    />
                    {(errors.countryOfOriginSelect ||
                      errors.countryOfOriginInput) && (
                      <p role="alert" className="text-xs text-destructive">
                        Country of Origin is required
                      </p>
                    )}
                  </div>
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
            {isPending ? <Spinner /> : <PiCheckCircleDuotone />}
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
