"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";
import type { FileMetadata } from "@/hooks/general/use-file-upload";
import { useFileUpload } from "@/hooks/general/use-file-upload";
import { useCreateProject } from "@/hooks/project/useCreateProject";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
import { Department } from "@/types/department";
import { uploadFiles } from "@/utils/uploadthing";
import { ImagePlusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import {
  PiBuildingsDuotone,
  PiKanbanDuotone,
  PiPlusCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "react-oidc-context";
import AddUsersInProjectDropdown from "./AddUsersInProjectDropdown";

interface User {
  _id: string;
  name: string;
  profileAvatar: string;
}

interface DialogCreateProjectProps {
  trigger?: React.ReactElement;
}

type FormValues = {
  project_name: string;
  project_number: string;
  project_manager: string;
  project_description: string;
  department: string;
};

export default function ProjectCreateDialog({
  trigger,
}: DialogCreateProjectProps) {
  const id = useId();

  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [projectImage, setProjectImage] = useState<File | FileMetadata | null>(
    null
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: departmentsData } = useGetAllDepartments();
  const { data: usersData } = useGetAllUsersByWorkspace();
  const { mutate: createProject, isPending } = useCreateProject();
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;
  const workspaceId = auth?.user?.profile?.workspaceId;

  const departments = departmentsData?.result?.departments || [];
  const users = usersData?.data;

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
      let utRes;
      console.log("image in project:", projectImage);
      if (projectImage) {
        setUploadingImage(true);
        utRes = await uploadFiles("imageUploader", {
          files: [projectImage as File],
        });
        setUploadingImage(false);
      }

      if (!utRes && projectImage) {
        throw new Error("Image upload failed");
      }

      createProject(
        {
          project_name: data.project_name,
          project_description: data.project_description,
          project_manager: data.project_manager,
          project_number: data.project_number,
          department_id: data.department,
          users: selectedUsers.map((user) => user._id),
          image: utRes?.[0]?.ufsUrl || "",
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
            console.error("Error creating project:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error uploading project image:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="flex items-center gap-2">
          <PiPlusCircleDuotone className="w-5 h-5" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Create New Project</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Create a new project by providing details and adding members.
        </DialogDescription>
        <form
          id={`mutate-project-form-${id}`}
          className="overflow-y-auto"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex gap-4 p-4">
            <div className="w-1/3">
              <ProfileBg setProjectImage={setProjectImage} />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-4">
                <Label htmlFor={`${id}-project-name`}>Project Name</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    id={`${id}-project-name`}
                    placeholder="Enter project name"
                    type="text"
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
          <div className="flex gap-4 w-full px-4 pb-4">
            <div className="space-y-2 w-1/2">
              <Label htmlFor={`${id}-department`}>Department</Label>
              <Select
                value={watch("department")}
                onValueChange={(value) => setValue("department", value)}
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
                type="text"
                aria-invalid={errors.project_manager ? "true" : "false"}
                {...register("project_manager")}
              />
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-description`}>Project Description</Label>
                <Textarea
                  id={`${id}-description`}
                  placeholder="Describe the project's purpose and goals"
                  maxLength={220}
                  aria-describedby={`${id}-description`}
                  className="h-24 resize-none"
                  aria-invalid={errors.project_description ? "true" : "false"}
                  {...register("project_description", {
                    required: "Description is required",
                    maxLength: {
                      value: 220,
                      message: `Description must be at most 220 characters`,
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
                    {220 - (watch("project_description") || "").length}
                  </span>{" "}
                  characters left
                </p>
              </div>

              <div className="flex items-center gap-4 justify-between w-full p-4 border border-border rounded-lg bg-muted/5">
                <AddUsersInProjectDropdown
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
            form={`mutate-project-form-${id}`}
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
              : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfileBg({
  setProjectImage,
}: {
  setProjectImage: (file: File | FileMetadata) => void;
}) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });

  const ImageFile = files[0]?.file;

  const currentImage =
    files[0]?.preview ||
    (ImageFile && !(ImageFile instanceof File) ? ImageFile.url : null);

  setProjectImage(ImageFile);

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
            <PiKanbanDuotone className="w-12 h-12" />
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
