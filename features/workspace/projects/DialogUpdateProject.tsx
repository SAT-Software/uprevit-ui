"use client";

import { useEffect, useId, useState } from "react";
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
  PiCirclesThreePlusDuotone,
  PiPencilCircleDuotone,
} from "react-icons/pi";
import Image from "next/image";
import AddUsersInProjectDropdown from "./AddUsersInProjectDropdown";
import { useUpdateProject } from "@/hooks/project/useUpdateProject";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
import type { Project } from "@/types/project";
import type { FileMetadata } from "@/hooks/general/use-file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";
import { Department } from "@/types/department";
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

interface ProjectWithUsers extends Omit<Project, "users"> {
  users?: User[];
}

interface DialogUpdateProjectProps {
  project: ProjectWithUsers;
}

export default function DialogUpdateProject({
  project,
}: DialogUpdateProjectProps) {
  const { data: departmentsData } = useGetAllDepartments();
  const departments = departmentsData?.result?.departments || [];
  const { data: usersData } = useGetAllUsersByWorkspace();
  const users = usersData?.result?.users || [];
  const id = useId();

  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>(
    project?.users ?? []
  );
  const [newProjectImage, setNewProjectImage] = useState<File | null>(null);
  const [removeProjectImage, setRemoveProjectImage] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { mutate: updateProject, isPending } = useUpdateProject();

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
  } = useForm<FormValues>({
    mode: "onSubmit",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const descriptionText = watch("project_description") || "";

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
    if (removeProjectImage) {
      imageUrlToSend = "";
    } else if (newProjectImage) {
      setUploadingImage(true);
      const utRes = await uploadFiles("imageUploader", {
        files: [newProjectImage],
      });
      setUploadingImage(false);
      if (!utRes?.[0]?.ufsUrl) {
        throw new Error("Image upload failed");
      }
      imageUrlToSend = utRes[0].ufsUrl;
    } else {
      imageUrlToSend = project?.image || "";
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
        admin_id: project!.admin_id,
        workspace_id: project!.workspace_id,
        department_id: project!.department_id,
      },
      {
        onSuccess: () => {
          reset();
          setNewProjectImage(null);
          setRemoveProjectImage(false);
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <PiPencilCircleDuotone size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Update Project</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Update Project
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Update this project&apos;s details and members.
        </DialogDescription>
        <form
          id={`mutate-project-form-${id}`}
          className="overflow-y-auto"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex gap-4 px-6 pt-4">
            <div className="w-1/3">
              <ProfileBg
                setNewProjectImage={setNewProjectImage}
                setRemoveProjectImage={setRemoveProjectImage}
                imageUrl={project?.image}
              />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-4">
                <Label htmlFor={`${id}-project-name`}>Project Name</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id={`${id}-project-name`}
                    placeholder="Enter project name"
                    type="text"
                    defaultValue={project?.project_name}
                    aria-invalid={errors.project_name ? "true" : "false"}
                    {...register("project_name", {
                      required: "Project name is required",
                    })}
                  />
                  {errors.project_name && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.project_name.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <Label htmlFor={`${id}-project-number`}>Project Number</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id={`${id}-project-number`}
                    placeholder="Enter project number"
                    type="text"
                    defaultValue={project?.project_number}
                    aria-invalid={errors.project_number ? "true" : "false"}
                    {...register("project_number", {
                      required: "Project number is required",
                    })}
                  />
                  {errors.project_number && (
                    <p role="alert" className="text-xs text-destructive">
                      {errors.project_number.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 w-full px-6 pt-4">
            <div className="space-y-2 w-1/2">
              <Label htmlFor={`${id}-department`}>Department</Label>
              <Select
                defaultValue={project?.department_id}
                onValueChange={(value) => {
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
            <div className="space-y-4 w-1/2">
              <Label htmlFor={`${id}-manager-name`}>Project Manager</Label>
              <Input
                id={`${id}-manager-name`}
                placeholder="Enter manager's name"
                defaultValue={project?.project_manager}
                type="text"
                aria-invalid={errors.project_manager ? "true" : "false"}
                {...register("project_manager")}
              />
            </div>
          </div>

          <div className="px-6 pt-4 pb-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-description`}>Project Description</Label>
                <Textarea
                  id={`${id}-description`}
                  placeholder="Describe the project's purpose and goals"
                  maxLength={220}
                  defaultValue={project?.project_description}
                  aria-describedby={`${id}-description`}
                  className="h-24 resize-none"
                  aria-invalid={errors.project_description ? "true" : "false"}
                  {...register("project_description", {
                    required: "Description is required",
                    maxLength: {
                      value: 220,
                      message: `Description must be at most ${220} characters`,
                    },
                  })}
                />
                {errors.project_description && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.project_description.message}
                  </p>
                )}
                <p
                  id={`${id}-description`}
                  className="text-muted-foreground mt-2 text-right text-xs"
                  role="status"
                  aria-live="polite"
                >
                  <span className="tabular-nums">
                    {220 - descriptionText.length}
                  </span>{" "}
                  characters left
                </p>
              </div>

              <div className="flex items-center gap-4 justify-between w-full space-y-4">
                <AddUsersInProjectDropdown
                  onAddUser={handleAddUser}
                  onRemoveUser={handleRemoveUser}
                  selectedUsers={selectedUsers}
                  users={users}
                />
                <div className="mb-4 items-center justify-between w-1/2">
                  {selectedUsers.length > 0 && (
                    <div className="flex items-center -space-x-[0.525rem]">
                      {selectedUsers.slice(0, 4).map((user) => {
                        if (user.profileAvatar)
                          return (
                            <Image
                              key={user._id}
                              className="ring-background rounded-full ring-2"
                              src={user.profileAvatar}
                              width={28}
                              height={28}
                              alt={user.name}
                            />
                          );
                        return (
                          <div
                            key={user._id}
                            className="flex h-8 w-8 items-center justify-center border-2 border-white rounded-full bg-muted text-xs font-medium ring-background ring-2"
                          >
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                        );
                      })}
                      <p className="text-xs text-muted-foreground ml-4">
                        {selectedUsers.length} Members
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form={`mutate-project-form-${id}`}
            disabled={uploadingImage || isPending}
          >
            {uploadingImage
              ? "Uploading Image..."
              : isPending
              ? "Updating Project..."
              : "Update Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfileBg({
  setNewProjectImage,
  setRemoveProjectImage,
  imageUrl,
}: {
  setNewProjectImage: (file: File | null) => void;
  setRemoveProjectImage: (removed: boolean) => void;
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
      setNewProjectImage(null);
      setRemoveProjectImage(hadInitialImage);
    } else {
      const file = files[0]?.file;
      if (file instanceof File) {
        setNewProjectImage(file);
        setRemoveProjectImage(false);
      } else {
        setNewProjectImage(null);
        setRemoveProjectImage(false);
      }
    }
  }, [files, imageUrl, setNewProjectImage, setRemoveProjectImage]);

  return (
    <div className="h-32">
      <div className="bg-muted relative flex size-full  rounded-xl items-center justify-center overflow-hidden">
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
          <div className="flex items-center justify-center w-full h-full bg-muted rounded-md border border-input">
            <PiCirclesThreePlusDuotone className="w-24 h-24 text-muted-foreground/60" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
            onClick={openFileDialog}
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <ImagePlusIcon size={16} aria-hidden="true" />
          </button>
          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
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
