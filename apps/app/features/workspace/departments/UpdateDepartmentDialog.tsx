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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import {
  Field,
  FieldError,
  FieldGroup,
} from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@uprevit/ui/components/ui/input-group";
import Image from "next/image";
import AddUsersDropdown from "@/features/workspace/AddUsersDropdown";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { useGetUsersInfinite } from "@/hooks/user/useGetUsersInfinite";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { useUpdateDepartment } from "@/hooks/department/useUpdateDepartment";
import type { Department } from "@/types/department";
import type { FileMetadata } from "@/hooks/general/use-file-upload";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Delete02Icon,
  NewOfficeIcon,
  PropertyEditIcon,
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
  src?: string;
}

type FormValues = {
  department_name: string;
  manager?: string;
  department_description: string;
};

type DepartmentWithUsers = Omit<Department, "users"> & {
  users?: User[];
};

export default function UpdateDepartmentDialog({
  department,
}: {
  department?: DepartmentWithUsers;
}) {
  const id = useId();

  const [open, setOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [debouncedUserSearch, setDebouncedUserSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>(
    department?.users ?? [],
  );
  const [newDepartmentImage, setNewDepartmentImage] = useState<File | null>(
    null,
  );
  const [removeDepartmentImage, setRemoveDepartmentImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const { mutate: updateDepartment, isPending } = useUpdateDepartment();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);
  const existingImageValue = department?.imageKey || department?.image || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    mode: "onSubmit",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const descriptionLength = (watch("department_description") || "").length;

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
      if (removeDepartmentImage) {
        imageUrlToSend = "";
      } else if (newDepartmentImage) {
        setUploadingImage(true);
        const uploadedImage = await uploadFileToS3({
          file: newDepartmentImage,
        });
        imageUrlToSend = uploadedImage.key;
        imageSizeBytes = uploadedImage.size;
      } else {
        imageUrlToSend = existingImageValue;
      }

      updateDepartment(
        {
          _id: department!._id,
          department_name: data.department_name,
          department_description: data.department_description,
          manager: data.manager,
          users: selectedUsers.map((user) => user._id),
          image: imageUrlToSend,
          imageSizeBytes,
          admin_id: department!.admin_id,
          workspace_id: department!.workspace_id,
        },
        {
          onSuccess: () => {
            reset();
            setNewDepartmentImage(null);
            setRemoveDepartmentImage(false);
            setUserSearch("");
            setDebouncedUserSearch("");
            setOpen(false);
          },
        },
      );
    } catch (error) {
      console.error("Error uploading department image:", error);
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
              <Icon icon={PropertyEditIcon} size={16} strokeWidth={2} />
              Update
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Update department name, manager, description, members or department
            image.
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <AppDialogContent
        title="Update Department"
        description="Update this department's details and members."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Update Department",
          loadingLabel: uploadingImage ? "Uploading..." : "Updating...",
          form: `mutate-department-form-${id}`,
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
          id={`mutate-department-form-${id}`}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-4 p-4">
            <Field>
              <DepartmentImageUpload
                imageUrl={department?.image}
                setNewDepartmentImage={setNewDepartmentImage}
                setRemoveDepartmentImage={setRemoveDepartmentImage}
              />
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
                  defaultValue={department?.department_name}
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
                  defaultValue={department?.manager}
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
                  defaultValue={department?.department_description}
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
                tooltip="Add or remove workspace users assigned to this department."
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
  imageUrl,
  setNewDepartmentImage,
  setRemoveDepartmentImage,
}: {
  imageUrl?: string;
  setNewDepartmentImage: (file: File | null) => void;
  setRemoveDepartmentImage: (removed: boolean) => void;
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
    accept: DEPARTMENT_IMAGE_ACCEPT,
    maxSize: DEPARTMENT_IMAGE_MAX_SIZE,
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
      setNewDepartmentImage(null);
      setRemoveDepartmentImage(hadInitialImage);
      return;
    }

    const file = files[0]?.file;
    if (file instanceof File) {
      setNewDepartmentImage(file);
      setRemoveDepartmentImage(false);
      return;
    }

    setNewDepartmentImage(null);
    setRemoveDepartmentImage(false);
  }, [files, imageUrl, setNewDepartmentImage, setRemoveDepartmentImage]);

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
          tooltip="Update or remove the image used to identify this department."
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
