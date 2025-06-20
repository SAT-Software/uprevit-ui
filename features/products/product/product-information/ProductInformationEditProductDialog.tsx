"use client";

import { useId, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

// Import actual data from the pages
import { departments } from "@/app/(app)/departments/page";
import { projects } from "@/app/(app)/projects/page";

interface ProductData {
  productId: string;
  productName: string;
  description: string;
  departmentId: string;
  projectId: string;
  version: string;
  status: string;
  createdBy: string;
  modifiedBy: string;
  createdOn: string;
  modifiedOn: string;
}

interface ProductInformationField {
  label: string;
  value: string;
}

interface EditProductDialogProps {
  product: ProductData;
  productInformationFields?: ProductInformationField[];
}

export default function EditProductDialog({
  product,
  productInformationFields = [
    { label: "Market / Geography", value: "US, EU" },
    { label: "Country of Origin", value: "Australia" },
    { label: "OEM / Contract manufactured", value: "OEM" },
    { label: "Commercial / Clinical", value: "Commercial" },
  ],
}: EditProductDialogProps) {
  const id = useId();

  // Basic product information state
  const [productName, setProductName] = useState(product.productName);
  const [description, setDescription] = useState(product.description);

  // Product information fields state
  const [informationFields, setInformationFields] = useState(
    productInformationFields
  );
  const [newField, setNewField] = useState({ label: "", value: "" });

  // Find the department and project names based on IDs
  const department = departments.find(
    (dept) => dept.id === product.departmentId
  );
  const project = projects.find((proj) => proj.id === product.projectId);

  const handleUpdateField = (
    index: number,
    key: "label" | "value",
    value: string
  ) => {
    setInformationFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, [key]: value } : field))
    );
  };

  const handleRemoveField = (index: number) => {
    setInformationFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddField = () => {
    if (newField.label.trim() && newField.value.trim()) {
      setInformationFields((prev) => [...prev, { ...newField }]);
      setNewField({ label: "", value: "" });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="text-xs">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-7xl max-h-[90vh] [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Edit Product Information
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edit product details and information fields.
        </DialogDescription>
        <div className="overflow-y-auto">
          <div className="px-6 pt-4 pb-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Basic Product Information */}
              <Card className="rounded-xl shadow-none border">
                <CardHeader>
                  <CardTitle className="text-base">Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${id}-ppn`}>
                        Product Plan Number (PPN)
                      </Label>
                      <Input
                        id={`${id}-ppn`}
                        value={product.productId}
                        type="text"
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${id}-product-name`}>Product Name</Label>
                      <Input
                        id={`${id}-product-name`}
                        placeholder="Enter product name"
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${id}-description`}>Description</Label>
                      <Textarea
                        id={`${id}-description`}
                        placeholder="Enter product description"
                        className="min-h-[100px] resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${id}-department`}>Department</Label>
                        <Input
                          id={`${id}-department`}
                          value={department?.name || product.departmentId}
                          type="text"
                          disabled
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${id}-project`}>Project</Label>
                        <Input
                          id={`${id}-project`}
                          value={project?.name || product.projectId}
                          type="text"
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${id}-version`}>Version</Label>
                        <Input
                          id={`${id}-version`}
                          value={product.version}
                          type="text"
                          disabled
                          className="bg-muted"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${id}-status`}>Status</Label>
                        <Input
                          id={`${id}-status`}
                          value={product.status}
                          type="text"
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Product Information Fields */}
              <Card className="rounded-xl shadow-none border">
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle className="text-base">
                    Product Information
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddField}
                    disabled={!newField.label.trim() || !newField.value.trim()}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Field
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add New Field Inputs */}
                  <div className="grid grid-cols-1 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor={`${id}-new-label`} className="text-xs">
                        New Field Label
                      </Label>
                      <Input
                        id={`${id}-new-label`}
                        placeholder="Enter field label"
                        type="text"
                        value={newField.label}
                        onChange={(e) =>
                          setNewField((prev) => ({
                            ...prev,
                            label: e.target.value,
                          }))
                        }
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${id}-new-value`} className="text-xs">
                        New Field Value
                      </Label>
                      <Input
                        id={`${id}-new-value`}
                        placeholder="Enter field value"
                        type="text"
                        value={newField.value}
                        onChange={(e) =>
                          setNewField((prev) => ({
                            ...prev,
                            value: e.target.value,
                          }))
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Existing Information Fields */}
                  <div className="space-y-3">
                    {informationFields.map((field, index) => (
                      <div
                        key={index}
                        className="space-y-3 p-3 border rounded-lg"
                      >
                        <div className="space-y-2">
                          <Label
                            htmlFor={`${id}-field-label-${index}`}
                            className="text-xs"
                          >
                            Field Label
                          </Label>
                          <Input
                            id={`${id}-field-label-${index}`}
                            type="text"
                            value={field.label}
                            onChange={(e) =>
                              handleUpdateField(index, "label", e.target.value)
                            }
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor={`${id}-field-value-${index}`}
                            className="text-xs"
                          >
                            Field Value
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id={`${id}-field-value-${index}`}
                              type="text"
                              value={field.value}
                              onChange={(e) =>
                                handleUpdateField(
                                  index,
                                  "value",
                                  e.target.value
                                )
                              }
                              className="text-sm"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveField(index)}
                              className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">Save Changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
