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
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";

// Interface that matches the actual API response structure
interface ProductData {
  _id?: string;
  market_geography?: string;
  country_of_origin?: string;
  oem_contract_manufacturer?: string;
  commercial_clinical?: string;
  product_information?: {
    market_geography?: string;
    country_of_origin?: string;
    oem_contract_manufacturer?: string;
    commercial_clinical?: string;
  };
}

interface FormValues {
  marketGeography: string;
  countryOfOrigin: string;
  oemContractManufacturer: string;
  commercialClinical: string;
}

interface EditProductDialogProps {
  product: ProductData;
}

export default function EditProductDialog({ product }: EditProductDialogProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const { mutate: updateProductTabData, isPending } = useUpdateProductTabData();

  console.log(product);

  // Get current product information data - handle both possible data structures
  const initialValues = {
    marketGeography: product?.market_geography || "",
    countryOfOrigin: product?.country_of_origin || "",
    oemContractManufacturer: product?.oem_contract_manufacturer || "",
    commercialClinical: product?.commercial_clinical || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: initialValues,
    values: initialValues,
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!product?._id) {
      console.error("Product ID is missing");
      return;
    }

    const updateData = {
      id: product._id,
      action: "update_product_information",
      tab: "product-information",
      data: {
        market_geography: data.marketGeography,
        country_of_origin: data.countryOfOrigin,
        oem_contract_manufacturer: data.oemContractManufacturer,
        commercial_clinical: data.commercialClinical,
      },
    };

    updateProductTabData(updateData, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
      onError: (error) => {
        console.error("Failed to update product information:", error);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="text-xs">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-2xl max-h-[90vh] [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Edit Product Information
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
          <div className="px-6 pt-4 pb-6">
            <div className="space-y-4">
              {/* Market / Geography */}
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

              {/* Country of Origin */}
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

              {/* OEM / Contract manufactured */}
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

              {/* Commercial / Clinical */}
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
            form={`edit-product-info-form-${id}`}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
