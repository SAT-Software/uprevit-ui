"use client";

import { useId, useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ImagePlusIcon, XIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/general/use-file-upload";
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
import {
  PiBuildingsDuotone,
  PiPencilCircleDuotone,
  PiXCircleDuotone,
  PiCheckCircleDuotone,
} from "react-icons/pi";
import Image from "next/image";
import AddUsersInDepartmentDropdown from "./AddUsersInDepartmentDropdown";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
import { useUpdateDepartment } from "@/hooks/department/useUpdateDepartment";
import type { Department } from "@/types/department";
import type { FileMetadata } from "@/hooks/general/use-file-upload";
import { uploadFiles } from "@/utils/uploadthing";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const { data: usersData } = useGetAllUsersByWorkspace();
  const users = usersData?.data;
  const id = useId();

  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>(
    department?.users ?? []
  );
  const [newDepartmentImage, setNewDepartmentImage] = useState<File | null>(
    null
  );
  const [removeDepartmentImage, setRemoveDepartmentImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { mutate: updateDepartment, isPending } = useUpdateDepartment();

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
  const descriptionText = watch("department_description") || "";

  const handleAddUser = (user: User) => {
    if (!selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (user: User) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let imageUrlToSend: string;
    if (removeDepartmentImage) {
      imageUrlToSend = "";
    } else if (newDepartmentImage) {
      setUploadingImage(true);
      const utRes = await uploadFiles("imageUploader", {
        files: [newDepartmentImage],
      });
      setUploadingImage(false);
      if (!utRes?.[0]?.ufsUrl) {
        throw new Error("Image upload failed");
      }
      imageUrlToSend = utRes[0].ufsUrl;
    } else {
      imageUrlToSend = department?.image || "";
    }

    updateDepartment(
      {
        _id: department!._id,
        department_name: data.department_name,
        department_description: data.department_description,
        manager: data.manager,
        users: selectedUsers.map((user) => user._id),
        image: imageUrlToSend,
        admin_id: department!.admin_id,
        workspace_id: department!.workspace_id,
      },
      {
        onSuccess: () => {
          reset();
          setNewDepartmentImage(null);
          setRemoveDepartmentImage(false);
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
        >
          <PiPencilCircleDuotone className="w-4 h-4" />
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Update Department</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Update this department&apos;s details and members.
        </DialogDescription>
        <form
          id={`mutate-department-form-${id}`}
          className="overflow-y-auto"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex gap-4 p-4">
            <div className="w-1/3">
              <ProfileBg
                setNewDepartmentImage={setNewDepartmentImage}
                setRemoveDepartmentImage={setRemoveDepartmentImage}
                imageUrl={department?.image}
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-department-name`}>Department Name</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id={`${id}-department-name`}
                    placeholder="Enter department name"
                    type="text"
                    defaultValue={department?.department_name}
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
                  defaultValue={department?.manager}
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
                defaultValue={department?.department_description}
                aria-describedby={`${id}-description`}
                className="h-24 resize-none"
                aria-invalid={errors.department_description ? "true" : "false"}
                {...register("department_description", {
                  required: "Description is required",
                  maxLength: {
                    value: 220,
                    message: `Description must be at most ${220} characters`,
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
                    {220 - descriptionText.length}
                  </span>{" "}
                  characters left
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Members</Label>
              <div className="flex items-center gap-4 justify-between w-full p-4 border border-border rounded-lg bg-muted/5">
                <AddUsersInDepartmentDropdown
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
          >
            <PiCheckCircleDuotone />
            {uploadingImage
              ? "Uploading..."
              : isPending
              ? "Updating..."
              : "Update Department"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfileBg({
  setNewDepartmentImage,
  setRemoveDepartmentImage,
  imageUrl,
}: {
  setNewDepartmentImage: (file: File | null) => void;
  setRemoveDepartmentImage: (removed: boolean) => void;
  imageUrl?: string;
}) {
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

  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      initialFiles,
    });

  const fileItem = files[0];
  const ImageFile = fileItem?.file;
  const currentImage =
    fileItem?.preview ||
    (ImageFile && !(ImageFile instanceof File)
      ? (ImageFile as FileMetadata).url
      : null);

  useEffect(() => {
    const hadInitialImage = !!imageUrl;
    if (files.length === 0) {
      setNewDepartmentImage(null);
      setRemoveDepartmentImage(hadInitialImage);
    } else {
      const file = files[0]?.file;
      if (file instanceof File) {
        setNewDepartmentImage(file);
        setRemoveDepartmentImage(false);
      } else {
        setNewDepartmentImage(null);
        setRemoveDepartmentImage(false);
      }
    }
  }, [files, imageUrl, setNewDepartmentImage, setRemoveDepartmentImage]);

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
            <ImagePlusIcon size={16} aria-hidden="true" />
          </button>
          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-[color,box-shadow] outline-none hover:bg-destructive/90 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove image"
            >
              <XIcon size={16} aria-hidden="true" />
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
