"use client";

import { useId, useMemo, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@uprevit/ui/components/ui/dialog";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { Textarea } from "@uprevit/ui/components/ui/textarea";
import { PiPlusCircleDuotone, PiXCircleDuotone } from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";

import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";
import { useGetAllProjects } from "@/hooks/project/useGetAllProjects";
import { Department } from "@/types/department";
import { Project } from "@/types/project";
import { useCreateProduct } from "@/hooks/product/useCreateProduct";
import { useAuth } from "react-oidc-context";

interface FormValues {
  ppn: string;
  productName: string;
  description: string;
  department: string;
  project: string;
  version: number;
  status: string;
}

export default function CreateProductDialog() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const user = auth?.user?.profile;

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
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      ppn: "",
      productName: "",
      description: "",
      department: "",
      project: "",
      version: 1,
      status: "draft",
    },
    mode: "onSubmit",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedDepartment = watch("department");
  const selectedProject = watch("project");

  useEffect(() => {
    register("department", { required: "Department is required" });
    register("project", { required: "Project is required" });
  }, [register]);

  const { mutate: createProduct, isPending } = useCreateProduct();

  const filteredProjects = useMemo(() => {
    return selectedDepartment
      ? projects.filter(
          (project: Project) => project.department_id === selectedDepartment
        )
      : projects;
  }, [selectedDepartment, projects]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    try {
      const productData = {
        product_plan_number: data.ppn,
        product_name: data.productName,
        product_description: data.description,
        department_id: data.department,
        workspace_id: user?.workspaceId as string,
        project_id: data.project,
        version: data.version,
        status: data.status.toLowerCase() as "draft" | "submitted" | "archived",
      };

      createProduct(productData, {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
        onError: (error) => {
          console.error(error);
          // Keep open on error
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="flex items-center gap-2">
          <PiPlusCircleDuotone className="w-5 h-5" />
          Create New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Create New Product</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Create a new product by providing product details.
        </DialogDescription>
        <form
          id={`create-product-form-${id}`}
          className="create-product-dialog-scrollbar overflow-y-auto"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="p-4 space-y-4">
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
              <Label htmlFor={`${id}-ppn`}>Product Plan Number (PPN)</Label>
              <Input
                id={`${id}-ppn`}
                placeholder="Enter PPN"
                type="text"
                {...register("ppn", {
                  required: "PPN is required",
                  minLength: {
                    value: 10,
                    message: "PPN must be at least 10 alphanumeric characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9]/,
                    message: "PPN must be at least 10 alphanumeric characters",
                  },
                })}
              />
              {errors.ppn && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.ppn.message}
                </p>
              )}
            </div>

            <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-950 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100">
              <h4 className="mb-2 font-medium text-emerald-800 dark:text-emerald-200">
                General Guidelines for PPN
              </h4>
              <ul className="list-inside list-disc space-y-1 text-emerald-700 dark:text-emerald-300">
                <li>Must be alphanumeric & 10 characters long</li>
                <li>Each product part number should be unique</li>
                <li>Do not use special characters</li>
                <li>Example: PPN1234567</li>
              </ul>
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
              <div className="flex justify-between items-center">
                {errors.description ? (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                ) : (
                  <span />
                )}
                <p
                  className="text-muted-foreground text-xs"
                  role="status"
                  aria-live="polite"
                >
                  <span className="tabular-nums">
                    {220 - (watch("description") || "").length}
                  </span>{" "}
                  characters left
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-department`}>Department</Label>
                <Select
                  value={selectedDepartment}
                  onValueChange={(value) => {
                    setValue("department", value, { shouldValidate: true });
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
                    setValue("project", value, { shouldValidate: true });
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
          </div>
        </form>
        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={isPending}
            type="submit"
            size="sm"
            form={`create-product-form-${id}`}
          >
            {isPending ? <Spinner /> : <PiPlusCircleDuotone />}
            {isPending ? "Creating..." : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
