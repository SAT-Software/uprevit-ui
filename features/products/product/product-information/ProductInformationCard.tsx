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
  // Build fields from API data
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
        {/* <div className="flex items-center gap-2">
          <Button size="icon" variant="outline">
            <span className="sr-only">Edit</span>
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
            </svg>
          </Button>
          <Dialog open={showAddField} onOpenChange={setShowAddField}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddField(true)}
              >
                + Add Field
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-base font-semibold mb-4">
                  Add New Field
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <Input
                  type="text"
                  placeholder="Label"
                  value={newField.label}
                  onChange={(e) =>
                    setNewField((f) => ({ ...f, label: e.target.value }))
                  }
                />
                <Input
                  type="text"
                  placeholder="Value"
                  value={newField.value}
                  onChange={(e) =>
                    setNewField((f) => ({ ...f, value: e.target.value }))
                  }
                />
              </div>
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddField(false);
                    setNewField({ label: "", value: "" });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (newField.label.trim() && newField.value.trim()) {
                      setFields((f) => [...f, { ...newField }]);
                      setShowAddField(false);
                      setNewField({ label: "", value: "" });
                    }
                  }}
                  disabled={!newField.label.trim() || !newField.value.trim()}
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div> */}
      </CardHeader>
      <CardContent>
        {/* Dynamic Info Fields Grid */}
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
