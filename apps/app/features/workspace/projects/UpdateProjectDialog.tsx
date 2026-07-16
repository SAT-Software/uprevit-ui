"use client";

import { toast } from "sonner";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { useEffect, useId, useMemo, useState, type UIEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useFileUpload } from "@/hooks/general/use-file-upload";
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
import Image from "next/image";
import AddUsersDropdown from "@/features/workspace/AddUsersDropdown";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { useUpdateProject } from "@/hooks/project/useUpdateProject";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { useGetUsersInfinite } from "@/hooks/user/useGetUsersInfinite";
import type { Project } from "@/types/project";
import type { FileMetadata } from "@/hooks/general/use-file-upload";
import { useGetDepartmentsInfinite } from "@/hooks/department/useGetDepartmentsInfinite";
import { Department } from "@/types/department";
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Delete02Icon,
  KanbanIcon,
  PropertyEditIcon,
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
  src?: string;
}

interface ProjectWithUsers extends Omit<Project, "users"> {
  users?: User[];
}

interface DialogUpdateProjectProps {
  project: ProjectWithUsers;
}

export default function UpdateProjectDialog({
  project,
}: DialogUpdateProjectProps) {
  const id = useId();

  const [open, setOpen] = useState(false);
  const [departmentPopoverOpen, setDepartmentPopoverOpen] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [debouncedDepartmentSearch, setDebouncedDepartmentSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [debouncedUserSearch, setDebouncedUserSearch] = useState("");
  const [selectedDepartmentLabel, setSelectedDepartmentLabel] = useState<
    string | null
  >(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>(
    project?.users ?? [],
  );
  const [newProjectImage, setNewProjectImage] = useState<File | null>(null);
  const [removeProjectImage, setRemoveProjectImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const { mutate: updateProject, isPending } = useUpdateProject();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);
  const existingImageValue = project?.imageKey || project?.image || "";

  type FormValues = {
    project_name: string;
    project_number: string;
    project_manager: string;
    project_description: string;
    department: string;
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
      department: project?.department_id || "",
    },
    mode: "onSubmit",
  });

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

  const departments = useMemo(
    () =>
      departmentsData?.pages.flatMap(
        (page) => page.result?.departments ?? [],
      ) ?? [],
    [departmentsData],
  );

  const descriptionLength = (watch("project_description") || "").length;
  const selectedDepartmentId = watch("department");
  const selectedDepartment = departments.find(
    (dept: Department) => dept._id === selectedDepartmentId,
  );

  useEffect(() => {
    register("department", { required: "Department is required" });
  }, [register]);

  useEffect(() => {
    if (!selectedDepartmentLabel && project?.department_id) {
      const match = departments.find(
        (dept) => dept._id === project.department_id,
      );
      if (match?.department_name) {
        setSelectedDepartmentLabel(match.department_name);
      }
    }
  }, [departments, project.department_id, selectedDepartmentLabel]);

  const handleDepartmentListScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 40;

    if (nearBottom && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  const handleAddUser = (user: User) => {
    if (!selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (user: User) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      let imageUrlToSend: string;
      let imageSizeBytes: number | undefined;
      if (removeProjectImage) {
        imageUrlToSend = "";
      } else if (newProjectImage) {
        setUploadingImage(true);
        const uploadedImage = await uploadFileToS3({ file: newProjectImage });
        imageUrlToSend = uploadedImage.key;
        imageSizeBytes = uploadedImage.size;
      } else {
        imageUrlToSend = existingImageValue;
      }

      updateProject(
        {
          _id: project!._id,
          project_name: data.project_name,
          project_description: data.project_description,
          project_manager: data.project_manager,
          project_number: data.project_number,
          users: selectedUsers.map((user) => user._id),
          image: imageUrlToSend,
          imageSizeBytes,
          admin_id: project!.admin_id,
          workspace_id: project!.workspace_id,
          department_id: data.department || project!.department_id,
        },
        {
          onSuccess: () => {
            reset();
            setNewProjectImage(null);
            setRemoveProjectImage(false);
            setUserSearch("");
            setDebouncedUserSearch("");
            setOpen(false);
          },
        },
      );
    } catch (error) {
      console.error("Error uploading project image:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={(e) => {
                if (!isAdmin) {
                  e.preventDefault();
                  e.stopPropagation();
                  toast.warning("Insufficient privileges, contact Admin");
                  return;
                }
              }}
            >
              <Icon
                className="transition-colors delay-100 duration-200 ease-in-out"
                icon={PropertyEditIcon}
                size={16}
                strokeWidth={2}
              />
              Update
            </Button>
          </TooltipTrigger>
          <TooltipContent>Update project details</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <AppDialogContent
        title="Update Project"
        description="Update this project's details and members."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Update Project",
          loadingLabel: uploadingImage ? "Uploading..." : "Updating...",
          form: `mutate-project-form-${id}`,
          type: "submit",
          loading: uploadingImage || isPending,
          disabled: uploadingImage || isPending,
          icon: CheckmarkCircle01Icon,
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
              <ProjectImageUpload
                setNewProjectImage={setNewProjectImage}
                setRemoveProjectImage={setRemoveProjectImage}
                imageUrl={project?.image}
              />
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
                  defaultValue={project?.project_name}
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
                  defaultValue={project?.project_number}
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
                  defaultValue={project?.project_manager}
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
                  defaultValue={project?.project_description}
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
                tooltip="Add or remove workspace users assigned to this project."
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
  setNewProjectImage,
  setRemoveProjectImage,
  imageUrl,
}: {
  setNewProjectImage: (file: File | null) => void;
  setRemoveProjectImage: (removed: boolean) => void;
  imageUrl?: string;
}) {
  const uploadId = useId();

  const initialFiles = imageUrl
    ? [
        {
          name: imageUrl.split("/").pop() || "image",
          size: 0,
          type: "image/*",
          url: imageUrl,
          id: `bg-${imageUrl}`,
        },
      ]
    : [];

  const [
    { files, errors },
    { removeFile, openFileDialog, clearErrors, getInputProps },
  ] = useFileUpload({
    accept: PROJECT_IMAGE_ACCEPT,
    maxSize: PROJECT_IMAGE_MAX_SIZE,
    initialFiles,
  });

  const imageFile = files[0]?.file;

  const currentImage =
    files[0]?.preview ||
    (imageFile && !(imageFile instanceof File)
      ? (imageFile as FileMetadata).url
      : null);

  useEffect(() => {
    const hadInitialImage = !!imageUrl;
    if (files.length === 0) {
      setNewProjectImage(null);
      setRemoveProjectImage(hadInitialImage);
      return;
    }

    const file = files[0]?.file;
    if (file instanceof File) {
      setNewProjectImage(file);
      setRemoveProjectImage(false);
      return;
    }

    setNewProjectImage(null);
    setRemoveProjectImage(false);
  }, [files, imageUrl, setNewProjectImage, setRemoveProjectImage]);

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
          tooltip="Update or remove the image used to identify this project."
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
