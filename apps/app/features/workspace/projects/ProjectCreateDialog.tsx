"use client";

import { toast } from "sonner";
import { useEffect, useId, useMemo, useState, type UIEvent } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import Image from "next/image";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { useGetDepartmentsInfinite } from "@/hooks/department/useGetDepartmentsInfinite";
import type { FileMetadata } from "@/hooks/general/use-file-upload";
import { useFileUpload } from "@/hooks/general/use-file-upload";
import { useCreateProject } from "@/hooks/project/useCreateProject";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { useGetUsersInfinite } from "@/hooks/user/useGetUsersInfinite";
import { Department } from "@/types/department";
import { isAdminProfile } from "@/utils/isAdmin";
import AddUsersDropdown from "@/features/workspace/AddUsersDropdown";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  Delete02Icon,
  KanbanIcon,
  PlusSignSquareIcon,
  UnfoldMoreIcon,
  UploadSquare01Icon,
} from "@hugeicons/core-free-icons";

const PROJECT_IMAGE_ACCEPT =
  "image/png,image/jpg,image/jpeg,image/gif,image/webp";
const PROJECT_IMAGE_MAX_SIZE = 500 * 1024;
const PROJECT_IMAGE_HELPER_TEXT =
  "Supports PNG, JPEG, JPG, GIF, WEBP (under 500KB)";

interface User {
  _id: string;
  name: string;
  profileAvatar: string;
}

type FormValues = {
  project_name: string;
  project_number: string;
  project_manager: string;
  project_description: string;
  department: string;
};

export default function ProjectCreateDialog() {
  const id = useId();

  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [projectImage, setProjectImage] = useState<File | FileMetadata | null>(
    null,
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [departmentPopoverOpen, setDepartmentPopoverOpen] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [debouncedDepartmentSearch, setDebouncedDepartmentSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [debouncedUserSearch, setDebouncedUserSearch] = useState("");
  const [selectedDepartmentLabel, setSelectedDepartmentLabel] = useState<
    string | null
  >(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedDepartmentSearch(departmentSearch);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [departmentSearch]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedUserSearch(userSearch);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [userSearch]);

  const {
    data: departmentsData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending: isDepartmentsPending,
    isError: isDepartmentsError,
  } = useGetDepartmentsInfinite({
    enabled: open,
    search: debouncedDepartmentSearch,
  });
  const {
    data: usersData,
    fetchNextPage: fetchNextUsersPage,
    hasNextPage: hasNextUsersPage,
    isFetching: isUsersFetching,
    isFetchingNextPage: isUsersFetchingNextPage,
    isPending: isUsersPending,
    isError: isUsersError,
  } = useGetUsersInfinite({
    enabled: open,
    search: debouncedUserSearch,
  });
  const { mutate: createProject, isPending } = useCreateProject();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;
  const workspaceId = auth?.user?.profile?.workspaceId;
  const isAdmin = isAdminProfile(auth.user?.profile);

  const departments = useMemo(
    () =>
      departmentsData?.pages.flatMap(
        (page) => page.result?.departments ?? [],
      ) ?? [],
    [departmentsData],
  );
  const users = useMemo(
    () =>
      usersData?.pages.flatMap((page) => page.result?.users ?? []) ?? [],
    [usersData],
  );

  const handleUserListScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 40;

    if (nearBottom && hasNextUsersPage && !isUsersFetching) {
      fetchNextUsersPage();
    }
  };

  const handleDepartmentListScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 40;

    if (nearBottom && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      project_name: "",
      project_number: "",
      project_manager: "",
      project_description: "",
      department: "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    register("department", { required: "Department is required" });
  }, [register]);

  const selectedDepartmentId = watch("department");
  const selectedDepartment = departments.find(
    (dept: Department) => dept._id === selectedDepartmentId,
  );
  const descriptionLength = (watch("project_description") || "").length;

  const handleAddUser = (user: User) => {
    if (!selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (user: User) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };

  async function onSubmit(data: FormValues) {
    try {
      let imageKey = "";
      let imageSizeBytes: number | undefined;

      if (projectImage instanceof File) {
        setUploadingImage(true);
        const uploadedImage = await uploadFileToS3({ file: projectImage });
        imageKey = uploadedImage.key;
        imageSizeBytes = uploadedImage.size;
        setUploadingImage(false);
      }

      createProject(
        {
          project_name: data.project_name,
          project_description: data.project_description,
          project_manager: data.project_manager,
          project_number: data.project_number,
          department_id: data.department,
          users: selectedUsers.map((user) => user._id),
          image: imageKey,
          imageSizeBytes,
          admin_id: userId as string,
          workspace_id: workspaceId as string,
        },
        {
          onSuccess: () => {
            reset();
            setSelectedUsers([]);
            setDepartmentSearch("");
            setDebouncedDepartmentSearch("");
            setUserSearch("");
            setDebouncedUserSearch("");
            setSelectedDepartmentLabel(null);
            setOpen(false);
          },
          onError: (error) => {
            setSelectedUsers([]);
            console.error("Error creating project:", error);
          },
        },
      );
    } catch (error) {
      console.error("Error uploading project image:", error);
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                if (!isAdmin) {
                  e.preventDefault();
                  e.stopPropagation();
                  toast.warning("Insufficient privileges, contact Admin");
                  return;
                }
              }}
            >
              <Icon icon={PlusSignSquareIcon} size={16} strokeWidth={2} />
              Create Project
            </Button>
          </TooltipTrigger>
          <TooltipContent>Create a new project</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <AppDialogContent
        title="Create New Project"
        description="Create a new project by providing details and adding members."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Create Project",
          loadingLabel: uploadingImage ? "Uploading..." : "Creating...",
          form: `mutate-project-form-${id}`,
          type: "submit",
          loading: uploadingImage || isPending,
          disabled: uploadingImage || isPending,
          icon: PlusSignSquareIcon,
        }}
        secondaryAction={{
          label: "Cancel",
          icon: Cancel01Icon,
        }}
      >
        <form
          id={`mutate-project-form-${id}`}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-4 p-4">
            <Field>
              <ProjectImageUpload setProjectImage={setProjectImage} />
            </Field>

            <Field data-invalid={!!errors.project_name}>
              <FormFieldLabel
                htmlFor={`${id}-project-name`}
                label="Project Name"
                tooltip="The display name shown across the workspace for this project."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-project-name`}
                  placeholder="Enter project name"
                  type="text"
                  aria-invalid={errors.project_name ? "true" : "false"}
                  {...register("project_name", {
                    required: "Project name is required",
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.project_name]} />
            </Field>

            <Field data-invalid={!!errors.project_number}>
              <FormFieldLabel
                htmlFor={`${id}-project-number`}
                label="Project Number"
                tooltip="A unique identifier or reference number for this project."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-project-number`}
                  placeholder="Enter project number"
                  type="text"
                  aria-invalid={errors.project_number ? "true" : "false"}
                  {...register("project_number", {
                    required: "Project number is required",
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.project_number]} />
            </Field>

            <Field data-invalid={!!errors.department}>
              <FormFieldLabel
                htmlFor={`${id}-department`}
                label="Department"
                tooltip="The department this project belongs to."
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
                        selectedDepartment?.department_name ||
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
                              setSelectedDepartmentLabel(dept.department_name);
                              setDepartmentPopoverOpen(false);
                            }}
                          >
                            <span className="truncate">
                              {dept.department_name}
                            </span>
                          </CommandItem>
                        ))}
                        {isFetchingNextPage && (
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

            <Field data-invalid={!!errors.project_manager}>
              <FormFieldLabel
                htmlFor={`${id}-manager-name`}
                label="Project Manager"
                tooltip="Name of the person responsible for managing this project."
                optional
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-manager-name`}
                  placeholder="Enter manager's name"
                  type="text"
                  aria-invalid={errors.project_manager ? "true" : "false"}
                  {...register("project_manager")}
                />
              </InputGroup>
            </Field>

            <Field data-invalid={!!errors.project_description}>
              <FormFieldLabel
                htmlFor={`${id}-description`}
                label="Project Description"
                tooltip="A short summary of the project's purpose and goals."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupTextarea
                  id={`${id}-description`}
                  placeholder="Describe the project's purpose and goals"
                  maxLength={220}
                  className="min-h-24 resize-none"
                  aria-invalid={errors.project_description ? "true" : "false"}
                  {...register("project_description", {
                    required: "Description is required",
                    maxLength: {
                      value: 220,
                      message: "Description must be at most 220 characters",
                    },
                  })}
                />
                <InputGroupAddon align="block-end">
                  <div className="flex w-full items-center justify-between gap-2">
                    {errors.project_description ? (
                      <FieldError errors={[errors.project_description]} />
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

            <Field>
              <FormFieldLabel
                label="Members"
                tooltip="Add workspace users who should have access to this project."
                optional
              />
              <div className="flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-muted/5 p-4">
                <AddUsersDropdown
                  users={users.map((user) => ({
                    _id: user._id as string,
                    name: user.name,
                    profileAvatar: user.profileAvatar,
                  }))}
                  onAddUser={handleAddUser}
                  onRemoveUser={handleRemoveUser}
                  selectedUsers={selectedUsers}
                  userSearch={userSearch}
                  onUserSearchChange={setUserSearch}
                  onListScroll={handleUserListScroll}
                  isPending={isUsersPending}
                  isError={isUsersError}
                  isFetchingNextPage={isUsersFetchingNextPage}
                />
                <div className="flex flex-1 items-center justify-end">
                  {selectedUsers.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center -space-x-2">
                        {selectedUsers.slice(0, 4).map((user) => {
                          if (user.profileAvatar)
                            return (
                              <Image
                                key={user._id}
                                className="ring-background rounded-full ring-2"
                                src={user.profileAvatar}
                                width={24}
                                height={24}
                                alt={user.name}
                              />
                            );
                          return (
                            <div
                              key={user._id}
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium ring-2 ring-background"
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">
                        {selectedUsers.length}{" "}
                        {selectedUsers.length > 1 ? "Users" : "User"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Field>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}

function ProjectImageUpload({
  setProjectImage,
}: {
  setProjectImage: (file: File | FileMetadata | null) => void;
}) {
  const uploadId = useId();

  const [
    { files, errors },
    { removeFile, openFileDialog, clearErrors, getInputProps },
  ] = useFileUpload({
    accept: PROJECT_IMAGE_ACCEPT,
    maxSize: PROJECT_IMAGE_MAX_SIZE,
  });

  const imageFile = files[0]?.file;

  const currentImage =
    files[0]?.preview ||
    (imageFile && !(imageFile instanceof File) ? imageFile.url : null);

  useEffect(() => {
    const file = files[0]?.file;
    if (file instanceof File) {
      setProjectImage(file);
      return;
    }

    setProjectImage(null);
  }, [files, setProjectImage]);

  useEffect(() => {
    if (errors.length === 0) return;

    toast.error(errors[0]);
    clearErrors();
  }, [errors, clearErrors]);

  const handleRemove = () => {
    if (files[0]?.id) {
      removeFile(files[0].id);
    }
  };

  return (
    <div className="flex items-start gap-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-full border border-border bg-muted/30">
        {currentImage ? (
          <Image
            className="size-full object-cover"
            src={currentImage}
            alt={
              files[0]?.preview
                ? "Preview of uploaded project image"
                : "Project image"
            }
            width={80}
            height={80}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground/50">
            <Icon icon={KanbanIcon} size={28} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <FormFieldLabel
          htmlFor={uploadId}
          label="Project Image"
          tooltip="Upload an image to identify this project in lists and cards."
          optional
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openFileDialog}
          >
            <Icon icon={UploadSquare01Icon} size={14} strokeWidth={2} />
            Upload Image
          </Button>

          {currentImage ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <Icon icon={Delete02Icon} size={14} strokeWidth={2} />
              Remove
            </Button>
          ) : null}
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground/70">
          {PROJECT_IMAGE_HELPER_TEXT}
        </p>
      </div>

      <input
        {...getInputProps({ id: uploadId })}
        className="sr-only"
        aria-label="Upload project image"
      />
    </div>
  );
}
