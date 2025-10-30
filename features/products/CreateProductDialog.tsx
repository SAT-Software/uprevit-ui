"use client";

import { useId, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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

import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";
import { useGetAllProjects } from "@/hooks/project/useGetAllProjects";
import { Department } from "@/types/department";
import { Project } from "@/types/project";
import { useCreateProduct } from "@/hooks/product/useCreateProduct";

interface FormValues {
  ppn: string;
  productName: string;
  description: string;
  department: string;
  project: string;
  version: string;
  status: string;
}

export default function CreateProductDialog() {
  const id = useId();
  const [open, setOpen] = useState(false);

  const { data: departmentsData = [] } = useGetAllDepartments();
  const { data: projectsData = [] } = useGetAllProjects();

  const updateDepartmentsProjects = useMemo(() => {
    return {
      departments: departmentsData?.result?.departments ?? [],
      projects: projectsData?.result?.projects ?? [],
    };
  }, [departmentsData, projectsData]);

  const departments = updateDepartmentsProjects.departments;
  const projects = updateDepartmentsProjects.projects;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      ppn: "",
      productName: "",
      description: "",
      department: "",
      project: "",
      version: "1.0",
      status: "draft",
    },
    mode: "onSubmit",
  });

  const selectedDepartment = watch("department");
  const selectedProject = watch("project");

  const createMutation = useCreateProduct();

  const filteredProjects = useMemo(() => {
    return selectedDepartment
      ? projects.filter(
          (project: Project) => project.department_id === selectedDepartment
        )
      : projects;
  }, [selectedDepartment, projects]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await createMutation.mutateAsync({
        product_plan_number: data.ppn,
        product_name: data.productName,
        product_description: data.description,
        department_id: data.department,
        project_id: data.project,
        master_version: data.version,
        status: data.status.toLowerCase(),
      });

      reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <form
              id="create-product-form"
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor={`${id}-ppn`}>Product Plan Number (PPN)</Label>
                <Input
                  id={`${id}-ppn`}
                  placeholder="Enter PPN"
                  type="text"
                  {...register("ppn", {
                    required: "PPN is required",
                    minLength: {
                      value: 10,
                      message:
                        "PPN must be at least 10 alphanumeric characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9]/,
                      message:
                        "PPN must be at least 10 alphanumeric characters",
                    },
                  })}
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
                {errors.ppn && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.ppn.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-product-name`}>Product Name</Label>
                <Input
                  id={`${id}-product-name`}
                  placeholder="Enter product name"
                  type="text"
                  {...register("productName", {
                    required: "Product name is required",
                  })}
                />
                {errors.productName && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.productName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-description`}>Description</Label>
                <Textarea
                  id={`${id}-description`}
                  placeholder="Enter product description"
                  className="min-h-[100px] resize-none"
                  {...register("description", {
                    maxLength: {
                      value: 220,
                      message: "Description must be at most 220 characters",
                    },
                  })}
                />
                {errors.description && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-department`}>Department</Label>
                  <Select
                    value={selectedDepartment}
                    onValueChange={(value) => {
                      // This is a workaround to update the form value
                      const event = { target: { name: "department", value } };

                      register("department", {
                        required: "Department is required",
                      }).onChange(event);
                    }}
                  >
                    <SelectTrigger id={`${id}-department`}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept: Department) => (
                        <SelectItem key={dept._id} value={dept._id || ""}>
                          {dept.department_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.department.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-project`}>Project</Label>
                  <Select
                    value={selectedProject}
                    onValueChange={(value) => {
                      // This is a workaround to update the form value
                      const event = { target: { name: "project", value } };

                      register("project", {
                        required: "Project is required",
                      }).onChange(event);
                    }}
                    disabled={!selectedDepartment}
                  >
                    <SelectTrigger id={`${id}-project`}>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredProjects?.map((project: Project) => (
                        <SelectItem key={project._id} value={project._id || ""}>
                          {project.project_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.project && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.project.message}
                    </p>
                  )}
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
                    {...register("version")}
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
                    {...register("status")}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" form="create-product-form">
            Create Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
