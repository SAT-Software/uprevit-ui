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
} from "@uprevit/ui/components/ui/input-group";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";
import type { ProductMetadata } from "@/types/product";
import {
  DEVICE_CLASS_GROUPS,
  findDeviceClassOption,
} from "@/data/device-classes";
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
import { COUNTRIES } from "@/data/countries";
import * as Flags from "country-flag-icons/react/3x2";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  TaskEdit01Icon,
  Tick01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";

interface ProductData {
  id?: string;
  market_geography?: string;
  country_of_origin?: string;
  oem_contract_manufacturer?: string;
  commercial_clinical?: string;
  manufacturing_location?: string;
  class_of_device?: string;
  basic_udi_di?: string;
}

interface FormValues {
  marketGeographySelect: string;
  marketGeographyInput: string;
  countryOfOriginSelect: string;
  countryOfOriginInput: string;
  oemContractManufacturer: string;
  commercialClinical: string;
  manufacturingLocation: string;
  classOfDeviceSelect: string;
  classOfDeviceInput: string;
  basicUdiDi: string;
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
  const [classComboboxOpen, setClassComboboxOpen] = useState(false);
  const { mutate: updateProductTabData, isPending } = useUpdateProductTabData();
  const isSubmitted = productMetadata?.status === "submitted";

  const initialValues: FormValues = {
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
    classOfDeviceSelect:
      product?.class_of_device && findDeviceClassOption(product.class_of_device)
        ? product.class_of_device
        : "",
    classOfDeviceInput:
      product?.class_of_device &&
      !findDeviceClassOption(product.class_of_device)
        ? product.class_of_device
        : "",
    basicUdiDi: product?.basic_udi_di || "",
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

  const marketGeographySelect = watch("marketGeographySelect");
  const marketGeographyInput = watch("marketGeographyInput");
  const countryOfOriginSelect = watch("countryOfOriginSelect");
  const countryOfOriginInput = watch("countryOfOriginInput");
  const classOfDeviceSelect = watch("classOfDeviceSelect");
  const classOfDeviceInput = watch("classOfDeviceInput");
  const selectedDeviceClass = findDeviceClassOption(classOfDeviceSelect);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (isSubmitted) return;

    if (!product?.id) {
      console.error("Product ID is missing");
      return;
    }

    const updateData = {
      id: product.id,
      action: "update_product_information",
      tab: "product-information",
      data: {
        market_geography:
          data.marketGeographySelect || data.marketGeographyInput,
        country_of_origin:
          data.countryOfOriginSelect || data.countryOfOriginInput,
        oem_contract_manufacturer: data.oemContractManufacturer,
        commercial_clinical: data.commercialClinical,
        manufacturing_location: data.manufacturingLocation,
        class_of_device: data.classOfDeviceSelect || data.classOfDeviceInput,
        basic_udi_di: data.basicUdiDi,
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
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline" disabled={isSubmitted}>
              <Icon icon={TaskEdit01Icon} /> Update Product Info
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <TooltipContent side="bottom">
          {isSubmitted
            ? "Submitted products can't be edited"
            : "Edit product information fields"}
        </TooltipContent>
      </Tooltip>
      <AppDialogContent
        title="Edit Product Information"
        description="Edit product information fields."
        variant="form"
        size="xl"
        primaryAction={{
          label: "Save Changes",
          loadingLabel: "Saving...",
          form: `edit-product-info-form-${id}`,
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
          id={`edit-product-info-form-${id}`}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-6 p-4">
            <div
              className="space-y-3 rounded-lg border bg-muted/30 p-4"
              data-invalid={
                !!(errors.marketGeographySelect || errors.marketGeographyInput)
              }
            >
              <FormFieldLabel
                label="Market / Geography"
                tooltip="Target market or geographic region for this product. Choose one option: select from the list or enter a custom value."
              />
              <div className="space-y-2">
                <Field>
                  <FormFieldLabel
                    htmlFor={`${id}-market-geography`}
                    label="Select from list"
                    className="text-xs text-muted-foreground"
                  />
                  <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="default"
                        role="combobox"
                        aria-expanded={comboboxOpen}
                        className="w-full justify-between font-normal text-foreground/80"
                        disabled={!!marketGeographyInput}
                      >
                        {marketGeographySelect
                          ? GEO_MARKETS.find(
                              (market) =>
                                market.regionAcronym === marketGeographySelect,
                            )?.regionAcronym
                          : "Select market..."}
                        <Icon
                          icon={UnfoldMoreIcon}
                          size={16}
                          className="ml-2 shrink-0 opacity-50"
                        />
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
                                  const originalValue = GEO_MARKETS.find(
                                    (m) =>
                                      m.regionAcronym.toLowerCase() ===
                                      currentValue.toLowerCase(),
                                  )?.regionAcronym;

                                  if (originalValue) {
                                    setValue(
                                      "marketGeographySelect",
                                      originalValue === marketGeographySelect
                                        ? ""
                                        : originalValue,
                                      { shouldValidate: true },
                                    );
                                    setComboboxOpen(false);
                                  }
                                }}
                              >
                                <Icon
                                  icon={Tick01Icon}
                                  size={16}
                                  className={cn(
                                    "mr-2",
                                    marketGeographySelect === market.regionAcronym
                                      ? "opacity-100"
                                      : "opacity-0",
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
                </Field>

                <div className="flex items-center gap-2 py-1">
                  <div className="h-0 w-full border-t border-dashed border-border" />
                  <p className="shrink-0 px-2 text-[10px] font-light uppercase text-muted-foreground">
                    OR
                  </p>
                  <div className="h-0 w-full border-t border-dashed border-border" />
                </div>

                <Field>
                  <FormFieldLabel
                    htmlFor={`${id}-market-geography-custom`}
                    label="Enter custom"
                    className="text-xs text-muted-foreground"
                  />
                  <InputGroup size="md" className="bg-background">
                    <InputGroupInput
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
                  </InputGroup>
                </Field>
              </div>
              <FieldError
                errors={[
                  errors.marketGeographySelect || errors.marketGeographyInput
                    ? { message: "Market/Geography is required" }
                    : undefined,
                ]}
              />
            </div>

            <div
              className="space-y-3 rounded-lg border bg-muted/30 p-4"
              data-invalid={
                !!(errors.countryOfOriginSelect || errors.countryOfOriginInput)
              }
            >
              <FormFieldLabel
                label="Country of Origin"
                tooltip="Country where the product is manufactured or originates. Choose one option: select from the list or enter a custom value."
              />
              <div className="space-y-2">
                <Field>
                  <FormFieldLabel
                    htmlFor={`${id}-country-origin`}
                    label="Select from list"
                    className="text-xs text-muted-foreground"
                  />
                  <Popover
                    open={countryComboboxOpen}
                    onOpenChange={setCountryComboboxOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="default"
                        role="combobox"
                        aria-expanded={countryComboboxOpen}
                        className="w-full justify-between font-normal text-foreground/80"
                        disabled={!!countryOfOriginInput}
                      >
                        {countryOfOriginSelect ? (
                          <span className="flex items-center gap-2">
                            {(() => {
                              const country = COUNTRIES.find(
                                (c) => c.name === countryOfOriginSelect,
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
                        <Icon
                          icon={UnfoldMoreIcon}
                          size={16}
                          className="ml-2 shrink-0 opacity-50"
                        />
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
                                        currentValue.toLowerCase(),
                                    )?.name;

                                    if (originalValue) {
                                      setValue(
                                        "countryOfOriginSelect",
                                        originalValue === countryOfOriginSelect
                                          ? ""
                                          : originalValue,
                                        { shouldValidate: true },
                                      );
                                      setCountryComboboxOpen(false);
                                    }
                                  }}
                                >
                                  <Icon
                                    icon={Tick01Icon}
                                    size={16}
                                    className={cn(
                                      "mr-2",
                                      countryOfOriginSelect === country.name
                                        ? "opacity-100"
                                        : "opacity-0",
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
                </Field>

                <div className="flex items-center gap-2 py-1">
                  <div className="h-0 w-full border-t border-dashed border-border" />
                  <p className="shrink-0 px-2 text-[10px] font-light uppercase text-muted-foreground">
                    OR
                  </p>
                  <div className="h-0 w-full border-t border-dashed border-border" />
                </div>

                <Field>
                  <FormFieldLabel
                    htmlFor={`${id}-country-origin-custom`}
                    label="Enter custom"
                    className="text-xs text-muted-foreground"
                  />
                  <InputGroup size="md" className="bg-background">
                    <InputGroupInput
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
                  </InputGroup>
                </Field>
              </div>
              <FieldError
                errors={[
                  errors.countryOfOriginSelect || errors.countryOfOriginInput
                    ? { message: "Country of Origin is required" }
                    : undefined,
                ]}
              />
            </div>

            <Field data-invalid={!!errors.oemContractManufacturer}>
              <FormFieldLabel
                htmlFor={`${id}-oem-contract`}
                label="OEM / Contract manufacturer"
                tooltip="Original equipment manufacturer or contract manufacturer responsible for production."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-oem-contract`}
                  placeholder="Enter OEM/contract manufacturer"
                  type="text"
                  aria-invalid={errors.oemContractManufacturer ? "true" : "false"}
                  {...register("oemContractManufacturer", {
                    required: "OEM/Contract manufacturer is required",
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.oemContractManufacturer]} />
            </Field>

            <Field data-invalid={!!errors.commercialClinical}>
              <FormFieldLabel
                htmlFor={`${id}-commercial-clinical`}
                label="Commercial / Clinical"
                tooltip="Whether the device is intended for commercial or clinical use."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-commercial-clinical`}
                  placeholder="Enter commercial/clinical"
                  type="text"
                  aria-invalid={errors.commercialClinical ? "true" : "false"}
                  {...register("commercialClinical", {
                    required: "Commercial/Clinical is required",
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.commercialClinical]} />
            </Field>

            <Field data-invalid={!!errors.manufacturingLocation}>
              <FormFieldLabel
                htmlFor={`${id}-manufacturing-location`}
                label="Manufacturing Location"
                optional
                tooltip="Physical location where the product is manufactured."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-manufacturing-location`}
                  placeholder="Enter manufacturing location"
                  type="text"
                  aria-invalid={errors.manufacturingLocation ? "true" : "false"}
                  {...register("manufacturingLocation")}
                />
              </InputGroup>
              <FieldError errors={[errors.manufacturingLocation]} />
            </Field>

            <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
              <FormFieldLabel
                label="Class of Device"
                optional
                tooltip="Regulatory device classification (e.g., EU MDR, FDA). Choose one option: select from the list or enter a custom value."
              />
              <div className="space-y-2">
                <Field>
                  <FormFieldLabel
                    htmlFor={`${id}-class-device`}
                    label="Select from list"
                    className="text-xs text-muted-foreground"
                  />
                  <Popover
                    open={classComboboxOpen}
                    onOpenChange={setClassComboboxOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="default"
                        role="combobox"
                        aria-expanded={classComboboxOpen}
                        className="w-full justify-between font-normal text-foreground/80"
                        disabled={!!classOfDeviceInput}
                      >
                        {selectedDeviceClass ? (
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="truncate">
                              {selectedDeviceClass.className}
                            </span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              ({selectedDeviceClass.regulation})
                            </span>
                          </span>
                        ) : (
                          "Select device class..."
                        )}
                        <Icon
                          icon={UnfoldMoreIcon}
                          size={16}
                          className="ml-2 shrink-0 opacity-50"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] p-0"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <Command>
                        <CommandInput placeholder="Search device class..." />
                        <CommandList className="max-h-72 overflow-y-auto">
                          <CommandEmpty>No device class found.</CommandEmpty>
                          {DEVICE_CLASS_GROUPS.map((group) => (
                            <CommandGroup
                              key={group.regulation}
                              heading={group.regulation}
                            >
                              {group.options.map((deviceClass) => (
                                <CommandItem
                                  key={deviceClass.value}
                                  value={`${deviceClass.value} ${deviceClass.description || ""}`}
                                  className="items-start py-2"
                                  onSelect={() => {
                                    setValue(
                                      "classOfDeviceSelect",
                                      deviceClass.value === classOfDeviceSelect
                                        ? ""
                                        : deviceClass.value,
                                      { shouldValidate: true },
                                    );
                                    setClassComboboxOpen(false);
                                  }}
                                >
                                  <Icon
                                    icon={Tick01Icon}
                                    size={16}
                                    className={cn(
                                      "mt-0.5 shrink-0",
                                      classOfDeviceSelect === deviceClass.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                    <span className="text-sm font-medium leading-snug">
                                      {deviceClass.className}
                                    </span>
                                    {deviceClass.description ? (
                                      <span className="text-xs leading-snug text-muted-foreground">
                                        {deviceClass.description}
                                      </span>
                                    ) : null}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </Field>

                <div className="flex items-center gap-2 py-1">
                  <div className="h-0 w-full border-t border-dashed border-border" />
                  <p className="shrink-0 px-2 text-[10px] font-light uppercase text-muted-foreground">
                    OR
                  </p>
                  <div className="h-0 w-full border-t border-dashed border-border" />
                </div>

                <Field>
                  <FormFieldLabel
                    htmlFor={`${id}-class-device-custom`}
                    label="Enter custom"
                    className="text-xs text-muted-foreground"
                  />
                  <InputGroup size="md" className="bg-background">
                    <InputGroupInput
                      id={`${id}-class-device-custom`}
                      placeholder="Enter custom device class"
                      type="text"
                      disabled={!!classOfDeviceSelect}
                      {...register("classOfDeviceInput")}
                    />
                  </InputGroup>
                </Field>
              </div>
            </div>

            <Field data-invalid={!!errors.basicUdiDi}>
              <FormFieldLabel
                htmlFor={`${id}-basic-udi-di`}
                label="Basic UDI-DI"
                optional
                tooltip="Basic Unique Device Identification — device identifier used for regulatory tracking when applicable."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-basic-udi-di`}
                  placeholder="Enter Basic UDI-DI"
                  type="text"
                  aria-invalid={errors.basicUdiDi ? "true" : "false"}
                  {...register("basicUdiDi")}
                />
              </InputGroup>
              <FieldError errors={[errors.basicUdiDi]} />
            </Field>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}
