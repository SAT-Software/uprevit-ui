"use client";

import { toast } from "sonner";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { PiPlusSquareDuotone, PiXDuotone } from "react-icons/pi";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { useFileUpload } from "@/hooks/general/use-file-upload";
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
  PiBuildingsDuotone,
  PiPlusCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import Image from "next/image";
import { useCreateDepartment } from "@/hooks/department/useCreateDepartment";
import type { FileMetadata } from "@/hooks/general/use-file-upload";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
import AddUsersDropdown from "@/features/workspace/AddUsersDropdown";

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

  const { mutate: createDepartment, isPending } = useCreateDepartment();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();
  const { data: usersData } = useGetAllUsersByWorkspace();
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;
  const workspaceId = auth?.user?.profile?.workspaceId;
  const isAdmin = isAdminProfile(auth.user?.profile);
  const users = usersData?.data;

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

      if (departmentImage instanceof File) {
        setUploadingImage(true);
        const uploadedImage = await uploadFileToS3({ file: departmentImage });
        imageKey = uploadedImage.key;
        setUploadingImage(false);
      }

      createDepartment(
        {
          department_name: data.department_name,
          department_description: data.department_description,
          manager: data.manager,
          users: selectedUsers.map((user) => user._id),
          image: imageKey,
          admin_id: userId as string,
          workspace_id: workspaceId as string,
        },
        {
          onSuccess: () => {
            reset();
            setSelectedUsers([]);
            setOpen(false);
          },
          onError: (error) => {
            setSelectedUsers([]);
            console.error("Error creating department:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error uploading department image:", error);
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
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
          <PiPlusCircleDuotone className="w-5 h-5" />
          Create Department
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Create New Department</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Create a new department by providing details and adding members.
        </DialogDescription>
        <form
          id={`mutate-department-form-${id}`}
          className="overflow-y-auto"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex gap-4 p-4">
            <div className="w-1/3">
              <ProfileBg setDepartmentImage={setDepartmentImage} />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-department-name`}>Department Name</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id={`${id}-department-name`}
                    placeholder="Enter department name"
                    type="text"
                    aria-invalid={errors.department_name ? "true" : "false"}
                    {...register("department_name", {
                      required: "Department name is required",
                    })}
                  />
                  {errors.department_name && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.department_name.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-manager-name`}>Department Manager</Label>
                <Input
                  id={`${id}-manager-name`}
                  placeholder="Enter manager's name"
                  type="text"
                  aria-invalid={errors.manager ? "true" : "false"}
                  {...register("manager")}
                />
              </div>
            </div>
          </div>

          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-description`}>
                Department Description
              </Label>
              <Textarea
                id={`${id}-description`}
                placeholder="Describe the department's purpose and responsibilities"
                maxLength={220}
                aria-describedby={`${id}-description`}
                className="h-24 resize-none"
                aria-invalid={errors.department_description ? "true" : "false"}
                {...register("department_description", {
                  required: "Description is required",
                  maxLength: {
                    value: 220,
                    message: `Description must be at most 220 characters`,
                  },
                })}
              />
              <div className="flex justify-between items-center">
                {errors.department_description ? (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.department_description.message}
                  </p>
                ) : (
                  <span />
                )}
                <p
                  id={`${id}-description`}
                  className="text-muted-foreground text-xs"
                  role="status"
                  aria-live="polite"
                >
                  <span className="tabular-nums">
                    {220 - (watch("department_description") || "").length}
                  </span>{" "}
                  characters left
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Members</Label>
              <div className="flex items-center gap-4 justify-between w-full p-4 border border-border rounded-lg bg-muted/5">
                <AddUsersDropdown
                  users={users?.map((user: User) => ({
                    _id: user._id,
                    name: user.name,
                    profileAvatar: user.profileAvatar,
                  }))}
                  onAddUser={handleAddUser}
                  onRemoveUser={handleRemoveUser}
                  selectedUsers={selectedUsers}
                />
                <div className="flex items-center justify-end flex-1">
                  {selectedUsers.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center -space-x-2">
                        {selectedUsers.slice(0, 4).map((user) => {
                          if (user.profileAvatar)
                            return (
                              <Image
                                key={user._id}
                                className="ring-background rounded-full ring-2"
                                src={user.profileAvatar}
                                width={32}
                                height={32}
                                alt={user.name}
                              />
                            );
                          return (
                            <div
                              key={user._id}
                              className="flex h-8 w-8 items-center justify-center border border-border rounded-full bg-muted text-xs font-medium ring-background ring-2"
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        {selectedUsers.length} Users
                      </p>
                    </div>
                  )}
                </div>
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
            type="submit"
            size="sm"
            variant="default"
            form={`mutate-department-form-${id}`}
            disabled={uploadingImage || isPending}
            aria-busy={uploadingImage || isPending}
          >
            {uploadingImage || isPending ? (
              <Spinner />
            ) : (
              <PiPlusCircleDuotone />
            )}
            {uploadingImage
              ? "Uploading..."
              : isPending
              ? "Creating..."
              : "Create Department"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfileBg({
  setDepartmentImage,
}: {
  setDepartmentImage: (file: File | FileMetadata) => void;
}) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
	useFileUpload({
		accept: "image/png,image/jpg,image/jpeg,image/gif,image/webp",
	});

  const ImageFile = files[0]?.file;

  const currentImage =
    files[0]?.preview ||
    (ImageFile && !(ImageFile instanceof File) ? ImageFile.url : null);

  setDepartmentImage(ImageFile);

  return (
    <div className="h-40 w-full">
      <div className="bg-muted/30 border border-border relative flex size-full rounded-xl items-center justify-center overflow-hidden group transition-colors hover:bg-muted/50">
        {currentImage ? (
          <Image
            className="size-full object-cover rounded-xl"
            src={currentImage}
            alt={
              files[0]?.preview
                ? "Preview of uploaded image"
                : "Profile background"
            }
            width={512}
            height={96}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/50">
            <PiBuildingsDuotone className="w-12 h-12" />
            <span className="text-xs font-medium">Upload Image</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full bg-background text-foreground transition-[color,box-shadow] outline-none hover:bg-accent focus-visible:ring-[3px]"
            onClick={openFileDialog}
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <PiPlusSquareDuotone size={16} aria-hidden="true" />
          </button>
          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-[color,box-shadow] outline-none hover:bg-destructive/90 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove image"
            >
              <PiXDuotone size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <input
        {...getInputProps()}
        className="sr-only"
        aria-label="Upload image file"
      />
    </div>
  );
}
