"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ProductInformationCardProps {
  initialFields?: { label: string; value: string }[];
}

export default function ProductInformationCard({
  initialFields = [
    { label: "Market / Geography", value: "US, EU" },
    { label: "Country of Origin", value: "Australia" },
    { label: "OEM / Contract manufactured", value: "OEM" },
    { label: "Commercial / Clinical", value: "Commercial" },
  ],
}: ProductInformationCardProps) {
  // Dynamic info fields state
  const [fields, setFields] = useState(initialFields);
  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState({ label: "", value: "" });

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
