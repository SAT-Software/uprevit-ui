"use client";

import { useEffect, useId, useMemo, useState, type UIEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@uprevit/ui/components/ui/input-group";
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
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  PlusSignSquareIcon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";

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
  const [debouncedDepartmentSearch, setDebouncedDepartmentSearch] =
    useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [debouncedProjectSearch, setDebouncedProjectSearch] = useState("");
  const [selectedDepartmentLabel, setSelectedDepartmentLabel] = useState<
    string | null
  >(null);
  const [selectedProjectLabel, setSelectedProjectLabel] = useState<
    string | null
  >(null);
  const auth = useAuth();
  const user = auth?.user?.profile;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    clearErrors,
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
  const descriptionLength = (watch("description") || "").length;

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
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default" size="sm" className="group">
              <Icon
                icon={PlusSignSquareIcon}
                className="text-primary-foreground/60 group-hover:text-primary-foreground"
              />
              Create New Product
            </Button>
          </TooltipTrigger>
          <TooltipContent>Create a new product</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <AppDialogContent
        title="Create New Product"
        description="Create a new product by providing product details."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Create Product",
          loadingLabel: "Creating...",
          form: `create-product-form-${id}`,
          type: "submit",
          loading: isPending,
          disabled: isPending,
          icon: PlusSignSquareIcon,
        }}
        secondaryAction={{
          label: "Cancel",
          icon: Cancel01Icon,
        }}
      >
        <form
          id={`create-product-form-${id}`}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-4 p-4">
            <Field data-invalid={!!errors.productName}>
              <FormFieldLabel
                htmlFor={`${id}-product-name`}
                label="Product Name"
                tooltip="The display name shown across the workspace for this product."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-product-name`}
                  placeholder="Enter product name"
                  type="text"
                  aria-invalid={errors.productName ? "true" : "false"}
                  {...register("productName", {
                    required: "Product name is required",
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.productName]} />
            </Field>

            <Field data-invalid={!!errors.ppn}>
              <FormFieldLabel
                htmlFor={`${id}-ppn`}
                label="Product Plan Number (PPN)"
                tooltip="A unique alphanumeric identifier for this product."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-ppn`}
                  placeholder="Enter PPN"
                  type="text"
                  aria-invalid={errors.ppn ? "true" : "false"}
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
              </InputGroup>
              <FieldError errors={[errors.ppn]} />
            </Field>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-950 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100">
              <h4 className="mb-2 font-medium text-emerald-800 dark:text-emerald-200">
                General Guidelines for PPN
              </h4>
              <ul className="list-inside list-disc space-y-1 text-emerald-900 dark:text-emerald-300">
                <li>Must be alphanumeric & 10 characters long</li>
                <li>Each product part number should be unique</li>
                <li>Do not use special characters</li>
                <li>Example: PPN1234567</li>
              </ul>
            </div>

            <Field data-invalid={!!errors.description}>
              <FormFieldLabel
                htmlFor={`${id}-description`}
                label="Description"
                tooltip="A short summary of the product's purpose and details."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupTextarea
                  id={`${id}-description`}
                  placeholder="Enter product description"
                  className="min-h-24 resize-none"
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
                <InputGroupAddon align="block-end">
                  <div className="flex w-full items-center justify-between gap-2">
                    {errors.description ? (
                      <FieldError errors={[errors.description]} />
                    ) : (
                      <span />
                    )}
                    <InputGroupText className="text-xs text-muted-foreground/60">
                      <span className="tabular-nums">
                        {220 - descriptionLength}
                      </span>{" "}
                      characters left
                    </InputGroupText>
                  </div>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.department}>
                <FormFieldLabel
                  htmlFor={`${id}-department`}
                  label="Department"
                  tooltip="The department this product belongs to."
                />
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
                      className="h-9 w-full justify-between bg-background font-normal"
                    >
                      <span className="truncate">
                        {selectedDepartmentLabel ||
                          departments.find((d) => d._id === selectedDepartment)
                            ?.department_name ||
                          "Select department"}
                      </span>
                      <Icon
                        icon={UnfoldMoreIcon}
                        size={16}
                        className="ml-2 shrink-0 opacity-50"
                      />
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
                                setValue("project", "", { shouldDirty: true });
                                clearErrors("project");
                                setSelectedDepartmentLabel(
                                  dept.department_name,
                                );
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
                <FieldError errors={[errors.department]} />
              </Field>

              <Field data-invalid={!!errors.project}>
                <FormFieldLabel
                  htmlFor={`${id}-project`}
                  label="Project"
                  tooltip="The project this product belongs to."
                />
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
                      className="h-9 w-full justify-between bg-background font-normal"
                    >
                      <span className="truncate">
                        {selectedProjectLabel ||
                          projects.find((p) => p._id === selectedProject)
                            ?.project_name ||
                          "Select project"}
                      </span>
                      <Icon
                        icon={UnfoldMoreIcon}
                        size={16}
                        className="ml-2 shrink-0 opacity-50"
                      />
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
                <FieldError errors={[errors.project]} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FormFieldLabel
                  htmlFor={`${id}-version`}
                  label="Version"
                  tooltip="New products always start at version 1.0."
                />
                <InputGroup size="md" className="bg-muted">
                  <InputGroupInput
                    id={`${id}-version`}
                    value="1.0"
                    type="text"
                    disabled
                    {...register("version")}
                  />
                </InputGroup>
              </Field>

              <Field>
                <FormFieldLabel
                  htmlFor={`${id}-status`}
                  label="Status"
                  tooltip="New products are created in draft status."
                />
                <InputGroup size="md" className="bg-muted">
                  <InputGroupInput
                    id={`${id}-status`}
                    value="Draft"
                    type="text"
                    disabled
                    {...register("status")}
                  />
                </InputGroup>
              </Field>
            </div>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}
