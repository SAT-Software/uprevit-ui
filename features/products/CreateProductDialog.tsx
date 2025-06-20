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
import { PiPlusBold } from "react-icons/pi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import actual data from the pages
import { departments } from "@/app/(app)/departments/page";
import { projects } from "@/app/(app)/projects/page";

export default function CreateProductDialog() {
  const id = useId();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [ppn, setPpn] = useState<string>("");

  // Filter projects based on selected department
  const filteredProjects = selectedDepartment
    ? projects.filter((project) => project.departmentId === selectedDepartment)
    : projects;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          Create New Product <PiPlusBold />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Create New Product
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Create a new product by providing product details.
        </DialogDescription>
        <div className="overflow-y-auto">
          <div className="px-6 pt-4 pb-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-ppn`}>Product Plan Number (PPN)</Label>
                <Input
                  id={`${id}-ppn`}
                  placeholder="Enter PPN"
                  type="text"
                  value={ppn}
                  onChange={(e) => setPpn(e.target.value)}
                  required
                />
                <div className="rounded-md bg-emerald-50 p-3 text-xs">
                  <h4 className="mb-2 font-medium text-emerald-700">
                    General Guidelines for PPN
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-emerald-600">
                    <li>Must be alphanumeric & 10 characters long</li>
                    <li>Each product part number should be unique</li>
                    <li>Do not use special characters</li>
                    <li>Example: PPN1234567</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-product-name`}>Product Name</Label>
                <Input
                  id={`${id}-product-name`}
                  placeholder="Enter product name"
                  type="text"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-description`}>Description</Label>
                <Textarea
                  id={`${id}-description`}
                  placeholder="Enter product description"
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-department`}>Department</Label>
                  <Select
                    required
                    value={selectedDepartment}
                    onValueChange={(value) => {
                      setSelectedDepartment(value);
                      setSelectedProject(""); // Reset project when department changes
                    }}
                  >
                    <SelectTrigger id={`${id}-department`}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-project`}>Project</Label>
                  <Select
                    required
                    value={selectedProject}
                    onValueChange={setSelectedProject}
                    disabled={!selectedDepartment}
                  >
                    <SelectTrigger id={`${id}-project`}>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-version`}>Version</Label>
                  <Input
                    id={`${id}-version`}
                    value="1.0"
                    type="text"
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-status`}>Status</Label>
                  <Input
                    id={`${id}-status`}
                    value="Draft"
                    type="text"
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">Create Product</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
