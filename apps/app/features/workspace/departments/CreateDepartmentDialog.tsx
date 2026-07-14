"use client";

import { toast } from "sonner";
import { useEffect, useId, useMemo, useState, type UIEvent } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { useFileUpload } from "@/hooks/general/use-file-upload";
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
import Image from "next/image";
import { useCreateDepartment } from "@/hooks/department/useCreateDepartment";
import type { FileMetadata } from "@/hooks/general/use-file-upload";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { useGetUsersInfinite } from "@/hooks/user/useGetUsersInfinite";
import AddUsersDropdown from "@/features/workspace/AddUsersDropdown";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  Delete02Icon,
  NewOfficeIcon,
  PlusSignSquareIcon,
  UploadSquare01Icon,
} from "@hugeicons/core-free-icons";

const DEPARTMENT_IMAGE_ACCEPT =
  "image/png,image/jpg,image/jpeg,image/gif,image/webp";
const DEPARTMENT_IMAGE_MAX_SIZE = 500 * 1024;
const DEPARTMENT_IMAGE_HELPER_TEXT =
  "Supports PNG, JPEG, JPG, GIF, WEBP (under 500KB)";

interface User {
  _id: string;
  name: string;
  profileAvatar: string;
}

type FormValues = {
  department_name: string;
  manager?: string;
  department_description: string;
};

export default function CreateDepartmentDialog() {
  const id = useId();

  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [departmentImage, setDepartmentImage] = useState<
    File | FileMetadata | null
  >(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [debouncedUserSearch, setDebouncedUserSearch] = useState("");

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

  const { mutate: createDepartment, isPending } = useCreateDepartment();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;
  const workspaceId = auth?.user?.profile?.workspaceId;
  const isAdmin = isAdminProfile(auth.user?.profile);

  const users = useMemo(
    () => usersData?.pages.flatMap((page) => page.result?.users ?? []) ?? [],
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      department_name: "",
      manager: "",
      department_description: "",
    },
    mode: "onSubmit",
  });

  const descriptionLength = (watch("department_description") || "").length;

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

      if (departmentImage instanceof File) {
        setUploadingImage(true);
        const uploadedImage = await uploadFileToS3({ file: departmentImage });
        imageKey = uploadedImage.key;
        imageSizeBytes = uploadedImage.size;
        setUploadingImage(false);
      }

      createDepartment(
        {
          department_name: data.department_name,
          department_description: data.department_description,
          manager: data.manager,
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
            setUserSearch("");
            setDebouncedUserSearch("");
            setOpen(false);
          },
          onError: (error) => {
            setSelectedUsers([]);
            console.error("Error creating department:", error);
          },
        },
      );
    } catch (error) {
      console.error("Error uploading department image:", error);
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
              Create Department
            </Button>
          </TooltipTrigger>
          <TooltipContent>Create a new department</TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <AppDialogContent
        title="Create New Department"
        // titleTooltip="Create a department to organize projects and assign workspace members."
        description="Create a new department by providing details and adding members."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Create Department",
          loadingLabel: uploadingImage ? "Uploading..." : "Creating...",
          form: `mutate-department-form-${id}`,
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
          id={`mutate-department-form-${id}`}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-4 p-4">
            <Field>
              <DepartmentImageUpload setDepartmentImage={setDepartmentImage} />
            </Field>

            <Field data-invalid={!!errors.department_name}>
              <FormFieldLabel
                htmlFor={`${id}-department-name`}
                label="Department Name"
                tooltip="The display name shown across the workspace for this department."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-department-name`}
                  placeholder="Enter department name"
                  type="text"
                  aria-invalid={errors.department_name ? "true" : "false"}
                  {...register("department_name", {
                    required: "Department name is required",
                  })}
                />
              </InputGroup>
              <FieldError errors={[errors.department_name]} />
            </Field>

            <Field data-invalid={!!errors.manager}>
              <FormFieldLabel
                htmlFor={`${id}-manager-name`}
                label="Department Manager"
                tooltip="Name of the person responsible for managing this department."
                optional
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-manager-name`}
                  placeholder="Enter manager's name"
                  type="text"
                  aria-invalid={errors.manager ? "true" : "false"}
                  {...register("manager")}
                />
              </InputGroup>
            </Field>

            <Field data-invalid={!!errors.department_description}>
              <FormFieldLabel
                htmlFor={`${id}-description`}
                label="Department Description"
                tooltip="A short summary of the department's purpose and responsibilities."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupTextarea
                  id={`${id}-description`}
                  placeholder="Describe the department's purpose and responsibilities"
                  maxLength={220}
                  className="min-h-24 resize-none"
                  aria-invalid={
                    errors.department_description ? "true" : "false"
                  }
                  {...register("department_description", {
                    required: "Description is required",
                    maxLength: {
                      value: 220,
                      message: "Description must be at most 220 characters",
                    },
                  })}
                />
                <InputGroupAddon align="block-end">
                  <div className="flex w-full items-center justify-between gap-2">
                    {errors.department_description ? (
                      <FieldError errors={[errors.department_description]} />
                    ) : (
                      <span />
                    )}
                    <InputGroupText className="text-xs text-muted-foreground/60">
                      <span className="tabular-nums">
                        {220 - descriptionLength}
                      </span>
                      characters left
                    </InputGroupText>
                  </div>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field>
              <FormFieldLabel
                label="Members"
                tooltip="Add workspace users who should have access to this department."
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

function DepartmentImageUpload({
  setDepartmentImage,
}: {
  setDepartmentImage: (file: File | FileMetadata | null) => void;
}) {
  const uploadId = useId();

  const [
    { files, errors },
    { removeFile, openFileDialog, clearErrors, getInputProps },
  ] = useFileUpload({
    accept: DEPARTMENT_IMAGE_ACCEPT,
    maxSize: DEPARTMENT_IMAGE_MAX_SIZE,
  });

  const imageFile = files[0]?.file;

  const currentImage =
    files[0]?.preview ||
    (imageFile && !(imageFile instanceof File) ? imageFile.url : null);

  useEffect(() => {
    const file = files[0]?.file;
    if (file instanceof File) {
      setDepartmentImage(file);
      return;
    }

    setDepartmentImage(null);
  }, [files, setDepartmentImage]);

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
                ? "Preview of uploaded department image"
                : "Department image"
            }
            width={80}
            height={80}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground/50">
            <Icon icon={NewOfficeIcon} size={28} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <FormFieldLabel
          htmlFor={uploadId}
          label="Department Image"
          tooltip="Upload an image to identify this department in lists and cards."
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
              variant="outline"
              size="sm"
              className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
              onClick={handleRemove}
            >
              <Icon icon={Delete02Icon} size={14} strokeWidth={2} />
              Remove
            </Button>
          ) : null}
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground/70">
          {DEPARTMENT_IMAGE_HELPER_TEXT}
        </p>
      </div>

      <input
        {...getInputProps({ id: uploadId })}
        className="sr-only"
        aria-label="Upload department image"
      />
    </div>
  );
}
