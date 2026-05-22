"use client";

import { useEffect, useId, useMemo, useState, type UIEvent } from "react";
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
import {
  PiCaretDownDuotone,
  PiPlusCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@uprevit/ui/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";

import { useGetDepartmentsInfinite } from "@/hooks/department/useGetDepartmentsInfinite";
import { useGetProjectsInfinite } from "@/hooks/project/useGetProjectsInfinite";
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
  const [departmentPopoverOpen, setDepartmentPopoverOpen] = useState(false);
  const [projectPopoverOpen, setProjectPopoverOpen] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [debouncedDepartmentSearch, setDebouncedDepartmentSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [debouncedProjectSearch, setDebouncedProjectSearch] = useState("");
  const [selectedDepartmentLabel, setSelectedDepartmentLabel] = useState<
    string | null
  >(null);
  const [selectedProjectLabel, setSelectedProjectLabel] = useState<string | null>(
    null,
  );
  const auth = useAuth();
  const user = auth?.user?.profile;

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
    const timer = window.setTimeout(() => {
      setDebouncedDepartmentSearch(departmentSearch);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [departmentSearch]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedProjectSearch(projectSearch);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [projectSearch]);

  useEffect(() => {
    register("department", { required: "Department is required" });
    register("project", { required: "Project is required" });
  }, [register]);

  const {
    data: departmentsData,
    fetchNextPage: fetchNextDepartmentPage,
    hasNextPage: hasNextDepartmentPage,
    isFetching: isDepartmentsFetching,
    isFetchingNextPage: isFetchingNextDepartmentPage,
    isPending: isDepartmentsPending,
    isError: isDepartmentsError,
  } = useGetDepartmentsInfinite({
    enabled: open,
    search: debouncedDepartmentSearch,
  });

  const {
    data: projectsData,
    fetchNextPage: fetchNextProjectPage,
    hasNextPage: hasNextProjectPage,
    isFetching: isProjectsFetching,
    isFetchingNextPage: isFetchingNextProjectPage,
    isPending: isProjectsPending,
    isError: isProjectsError,
  } = useGetProjectsInfinite({
    enabled: open && !!selectedDepartment,
    departmentId: selectedDepartment,
    search: debouncedProjectSearch,
  });

  const departments = useMemo(
    () =>
      departmentsData?.pages.flatMap(
        (page) => page.result?.departments ?? [],
      ) ?? [],
    [departmentsData],
  );

  const projects = useMemo(
    () =>
      projectsData?.pages.flatMap((page) => page.result?.projects ?? []) ?? [],
    [projectsData],
  );

  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleDepartmentListScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 40;

    if (nearBottom && hasNextDepartmentPage && !isDepartmentsFetching) {
      fetchNextDepartmentPage();
    }
  };

  const handleProjectListScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 40;

    if (nearBottom && hasNextProjectPage && !isProjectsFetching) {
      fetchNextProjectPage();
    }
  };

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
          setDepartmentSearch("");
          setDebouncedDepartmentSearch("");
          setProjectSearch("");
          setDebouncedProjectSearch("");
          setSelectedDepartmentLabel(null);
          setSelectedProjectLabel(null);
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
                aria-invalid={errors.description ? "true" : "false"}
                {...register("description", {
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Product description is required",
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
                <Popover
                  open={departmentPopoverOpen}
                  onOpenChange={setDepartmentPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      id={`${id}-department`}
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={departmentPopoverOpen}
                      className="w-full justify-between font-normal h-9"
                    >
                      <span className="truncate">
                        {selectedDepartmentLabel ||
                          departments.find(
                            (d) => d._id === selectedDepartment,
                          )?.department_name ||
                          "Select department"}
                      </span>
                      <PiCaretDownDuotone className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-(--radix-popover-trigger-width) p-0"
                    align="start"
                    onWheel={(event) => event.stopPropagation()}
                  >
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search departments..."
                        className="h-9"
                        value={departmentSearch}
                        onValueChange={setDepartmentSearch}
                      />
                      <CommandList onScroll={handleDepartmentListScroll}>
                        <CommandEmpty>
                          {isDepartmentsPending
                            ? "Loading departments..."
                            : isDepartmentsError
                              ? "Failed to load departments."
                              : "No department found."}
                        </CommandEmpty>
                        <CommandGroup>
                          {departments.map((dept: Department) => (
                            <CommandItem
                              key={dept._id}
                              value={dept.department_name}
                              onSelect={() => {
                                setValue("department", dept._id || "", {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });
                                setValue("project", "", {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });
                                setSelectedDepartmentLabel(dept.department_name);
                                setSelectedProjectLabel(null);
                                setProjectSearch("");
                                setDebouncedProjectSearch("");
                                setDepartmentPopoverOpen(false);
                              }}
                            >
                              <span className="truncate">
                                {dept.department_name}
                              </span>
                            </CommandItem>
                          ))}
                          {isFetchingNextDepartmentPage && (
                            <div className="flex items-center justify-center py-2">
                              <Spinner className="size-4" />
                            </div>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.department && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.department.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-project`}>Project</Label>
                <Popover
                  open={projectPopoverOpen}
                  onOpenChange={setProjectPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      id={`${id}-project`}
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={projectPopoverOpen}
                      disabled={!selectedDepartment}
                      className="w-full justify-between font-normal h-9"
                    >
                      <span className="truncate">
                        {selectedProjectLabel ||
                          projects.find((p) => p._id === selectedProject)
                            ?.project_name ||
                          "Select project"}
                      </span>
                      <PiCaretDownDuotone className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-(--radix-popover-trigger-width) p-0"
                    align="start"
                    onWheel={(event) => event.stopPropagation()}
                  >
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search projects..."
                        className="h-9"
                        value={projectSearch}
                        onValueChange={setProjectSearch}
                      />
                      <CommandList onScroll={handleProjectListScroll}>
                        <CommandEmpty>
                          {isProjectsPending
                            ? "Loading projects..."
                            : isProjectsError
                              ? "Failed to load projects."
                              : "No project found."}
                        </CommandEmpty>
                        <CommandGroup>
                          {projects.map((proj: Project) => (
                            <CommandItem
                              key={proj._id}
                              value={proj.project_name}
                              onSelect={() => {
                                setValue("project", proj._id || "", {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });
                                setSelectedProjectLabel(proj.project_name);
                                setProjectPopoverOpen(false);
                              }}
                            >
                              <span className="truncate">
                                {proj.project_name}
                              </span>
                            </CommandItem>
                          ))}
                          {isFetchingNextProjectPage && (
                            <div className="flex items-center justify-center py-2">
                              <Spinner className="size-4" />
                            </div>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
