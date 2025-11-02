"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface ProductInformationCardProps {
  marketGeography?: string;
  countryOfOrigin?: string;
  oemContractManufacturer?: string;
  commercialClinical?: string;
  customFields?: { label: string; value: string }[];
}

export default function ProductInformationCard({
  marketGeography,
  countryOfOrigin,
  oemContractManufacturer,
  commercialClinical,
  customFields = [],
}: ProductInformationCardProps) {
  const fields = useMemo(() => {
    const baseFields = [
      { label: "Market / Geography", value: marketGeography || "N/A" },
      { label: "Country of Origin", value: countryOfOrigin || "N/A" },
      {
        label: "OEM / Contract manufactured",
        value: oemContractManufacturer || "N/A",
      },
      { label: "Commercial / Clinical", value: commercialClinical || "N/A" },
    ];

    // Add custom fields if they exist
    if (customFields && customFields.length > 0) {
      return [...baseFields, ...customFields];
    }

    return baseFields;
  }, [
    marketGeography,
    countryOfOrigin,
    oemContractManufacturer,
    commercialClinical,
    customFields,
  ]);

  return (
    <Card className="rounded-xl shadow-none">
      <CardHeader className="flex-row justify-between">
        <CardTitle>Product Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-2">
          {fields.map((field, idx) => (
            <div key={idx}>
              <div className="text-sm text-muted-foreground">{field.label}</div>
              <div className="font-medium text-base mt-1">{field.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
