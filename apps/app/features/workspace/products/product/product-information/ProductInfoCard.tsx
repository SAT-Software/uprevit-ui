"use client";

import { Card, CardContent } from "@uprevit/ui/components/ui/card";
import { useMemo } from "react";

interface ProductInformationCardProps {
  marketGeography?: string;
  countryOfOrigin?: string;
  oemContractManufacturer?: string;
  commercialClinical?: string;
  classOfDevice?: string;
  basicUdiDi?: string;
  customFields?: { label: string; value: string }[];
}

export default function ProductInformationCard({
  marketGeography,
  countryOfOrigin,
  oemContractManufacturer,
  commercialClinical,
  classOfDevice,
  basicUdiDi,
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
      { label: "Class of Device", value: classOfDevice || "N/A" },
      { label: "Basic UDI-DI", value: basicUdiDi || "N/A" },
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
    classOfDevice,
    basicUdiDi,
    customFields,
  ]);

  return (
    <Card className="rounded-xl shadow-none">
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
