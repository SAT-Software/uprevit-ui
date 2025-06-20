import { CheckIcon, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import actual data
import { departments } from "@/app/(app)/departments/page";
import { sampleProducts } from "@/app/(app)/products/page";
import { projects } from "@/app/(app)/projects/page";
import {
  PiStackPlusDuotone,
  PiCirclesThreePlusDuotone,
  PiKanbanDuotone,
} from "react-icons/pi";

interface DialogAddProductsToFolderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderName: string;
  onAddProducts: (products: string[]) => void;
}

export default function DialogAddProductsToFolder({
  open,
  onOpenChange,
  folderName,
  onAddProducts,
}: DialogAddProductsToFolderProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Transform departments data to include project count
  const departmentsWithProjectCount = useMemo(() => {
    return departments.map((dept) => ({
      ...dept,
      projectCount: projects.filter(
        (project) => project.departmentId === dept.id
      ).length,
    }));
  }, []);

  // Get projects for selected department
  const availableProjects = useMemo(() => {
    if (!selectedDepartment) return [];
    return projects
      .filter((project) => project.departmentId === selectedDepartment)
      .map((project) => ({
        ...project,
        productCount: sampleProducts.filter(
          (product) => product.projectId === project.id
        ).length,
      }));
  }, [selectedDepartment]);

  // Get products for selected project
  const availableProducts = useMemo(() => {
    if (!selectedProject) return [];
    return sampleProducts.filter(
      (product) => product.projectId === selectedProject
    );
  }, [selectedProject]);

  const handleReset = () => {
    setSelectedDepartment("");
    setSelectedProject("");
    setSelectedProducts([]);
  };

  const handleAddProducts = () => {
    if (selectedProducts.length > 0) {
      onAddProducts(selectedProducts);
      onOpenChange(false);
      handleReset();
    }
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen);
        if (!newOpen) handleReset();
      }}
    >
      <DialogContent className="max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusIcon size={20} />
            Add Products to &ldquo;{folderName}&rdquo;
          </DialogTitle>
          <DialogDescription>
            Select a department and project to view available products, then
            choose which products to add to this folder.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 flex-1 overflow-hidden">
          {/* Department and Project Selection - Side by Side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Department Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <PiCirclesThreePlusDuotone size={16} />
                Department
              </Label>
              <Select
                value={selectedDepartment}
                onValueChange={(value) => {
                  setSelectedDepartment(value);
                  setSelectedProject("");
                  setSelectedProducts([]);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a department..." />
                </SelectTrigger>
                <SelectContent>
                  {departmentsWithProjectCount.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      <div className="flex items-center gap-2 w-full">
                        <PiCirclesThreePlusDuotone
                          size={16}
                          className="text-muted-foreground"
                        />
                        <span className="flex-1">{department.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {department.projectCount} projects
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <PiKanbanDuotone size={16} />
                Project
              </Label>
              <Select
                value={selectedProject}
                onValueChange={(value) => {
                  setSelectedProject(value);
                  setSelectedProducts([]);
                }}
                disabled={!selectedDepartment}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a project..." />
                </SelectTrigger>
                <SelectContent>
                  {availableProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2 w-full">
                        <PiKanbanDuotone
                          size={16}
                          className="text-muted-foreground"
                        />
                        <span className="flex-1">{project.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {project.productCount} products
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Selection - 2 Columns Grid */}
          {selectedProject && availableProducts.length > 0 && (
            <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
              <Label className="text-sm font-medium">
                Select Products ({selectedProducts.length} selected)
              </Label>
              <ScrollArea className="flex-1 w-full rounded-md border p-4">
                <div className="grid grid-cols-2 gap-3">
                  {availableProducts.map((product) => (
                    <Card
                      key={product.productId}
                      className={`cursor-pointer transition-colors ${
                        selectedProducts.includes(product.productId)
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleProductToggle(product.productId)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedProducts.includes(
                              product.productId
                            )}
                            onChange={() =>
                              handleProductToggle(product.productId)
                            }
                            className="mt-1 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium text-sm truncate">
                                {product.productName}
                              </h4>
                              <span className="text-xs bg-muted px-2 py-1 rounded flex-shrink-0">
                                v{product.version}
                              </span>
                            </div>
                            <div className="mt-1">
                              <span
                                className={`text-xs px-2 py-1 rounded inline-block ${
                                  product.status === "Draft"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : product.status === "Submitted"
                                    ? "bg-blue-100 text-blue-800"
                                    : product.status === "Archived"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {product.status}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                          {selectedProducts.includes(product.productId) && (
                            <CheckIcon
                              size={16}
                              className="text-primary mt-1 flex-shrink-0"
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {selectedProject && availableProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <PiStackPlusDuotone
                size={48}
                className="mx-auto mb-2 opacity-50"
              />
              <p>No products available in this project</p>
            </div>
          )}

          {!selectedProject && (
            <div className="text-center py-16 border border-dashed border-border rounded-md text-muted-foreground">
              <PiStackPlusDuotone
                size={48}
                className="mx-auto mb-2 opacity-50"
              />
              <p>
                Please select a department and project to view available
                products.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddProducts}
            disabled={selectedProducts.length === 0}
          >
            Add{" "}
            {selectedProducts.length > 0 ? `${selectedProducts.length} ` : ""}
            Product{selectedProducts.length !== 1 ? "s" : ""} to Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
