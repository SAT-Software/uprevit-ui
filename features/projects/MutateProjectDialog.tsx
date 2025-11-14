"use client";

import { useId, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ImagePlusIcon, XIcon } from "lucide-react";
import { useAuth } from "react-oidc-context";
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
import { PiPlusCircleDuotone } from "react-icons/pi";
import Image from "next/image";
import AddProjectDropdown from "./AddMemberInProjectDropdown";
import { useCreateProject } from "@/hooks/project/useCreateProject";
import { useUpdateProject } from "@/hooks/project/useUpdateProject";
import type { Project } from "@/types/project";
import type { FileMetadata } from "@/hooks/general/use-file-upload";

type Mode = "create" | "update";

interface Member {
  name: string;
  src: string;
}

interface MutateProjectDialogProps {
  mode: Mode;
  project?: Project | null;
  trigger?: React.ReactElement;
  onSuccess?: (result: unknown) => void;
}

// Pretend we have initial image files, remove this after S3 storage is implemented
const fallbackBgImage = [
  {
    name: "department.jpg",
    size: 1528737,
    type: "image/jpeg",
    url: "/department.jpg",
    id: "project-123456789",
  },
];

export default function MutateProjectDialog({
  mode,
  project,
  trigger,
  onSuccess,
}: MutateProjectDialogProps) {
  const id = useId();

  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;
  const workspaceId = auth?.user?.profile?.workspaceId;

  type FormValues = {
    project_name: string;
    project_number: string;
    project_manager: string;
    project_description: string;
  };

  const initialValues: FormValues = useMemo(
    () => ({
      project_name: project?.project_name || "",
      project_number: project?.project_number || "",
      project_manager: project?.project_manager || "",
      project_description: project?.project_description || "",
    }),
    [project]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: initialValues,
    mode: "onSubmit",
    values: initialValues,
  });

  const maxLength = 220;
  const descriptionText = watch("project_description") || "";

  const handleAddMember = (member: Member) => {
    if (!members.some((m) => m.name === member.name)) {
      setMembers([...members, member]);
    }
  };

  const handleRemoveMember = (member: Member) => {
    setMembers(members.filter((m) => m.name !== member.name));
  };

  const isPending =
    mode === "create" ? createMutation.isPending : updateMutation.isPending;
  const dialogTitle =
    mode === "create" ? "Create New Project" : "Update Project";
  const submitLabel = isPending
    ? mode === "create"
      ? "Creating..."
      : "Updating..."
    : mode === "create"
    ? "Create Project"
    : "Update Project";

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      if (mode === "create") {
        const res = await createMutation.mutateAsync({
          project_name: data.project_name,
          project_description: data.project_description,
          project_manager: data.project_manager,
          project_number: data.project_number,
          users: members.map((member) => member.name),
          image: "",
          admin_id: userId,
          workspace_id: workspaceId,
          department_id: "68d2bfbee20298cdc7141afe", // TODO: implement department selection
        } as Project);
        onSuccess?.(res);
        setOpen(false);
      } else {
        if (!project?._id) throw new Error("Project id missing for update");
        const res = await updateMutation.mutateAsync({
          _id: project._id,
          project_name: data.project_name,
          project_description: data.project_description,
          project_manager: data.project_manager,
          project_number: data.project_number,
          users: members.map((member) => member.name),
          image: project.image || "",
          admin_id: project.admin_id,
          workspace_id: project.workspace_id,
          department_id: project.department_id,
        } as Project);
        onSuccess?.(res);
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      reset();
      setMembers([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="default" className="flex items-center gap-2">
            {mode === "create" ? (
              <>
                Create New Project <PiPlusCircleDuotone />
              </>
            ) : (
              "Update Project"
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          {mode === "create"
            ? "Create a new project by providing details and adding members."
            : "Update this project's details and members."}
        </DialogDescription>
        <form
          id={`mutate-project-form-${id}`}
          className="overflow-y-auto"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex gap-4 px-6 pt-4">
            <div className="w-1/3">
              <ProfileBg imageUrl={project?.image} />
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
                    {...register("project_number")}
                  />
                </div>
              </div>
              <div className="space-y-4">
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
          </div>

          <div className="px-6 pt-4 pb-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-description`}>Project Description</Label>
                <Textarea
                  id={`${id}-description`}
                  placeholder="Describe the project's purpose and goals"
                  maxLength={maxLength}
                  aria-describedby={`${id}-description`}
                  className="h-24 resize-none"
                  aria-invalid={errors.project_description ? "true" : "false"}
                  {...register("project_description", {
                    required: "Description is required",
                    maxLength: {
                      value: maxLength,
                      message: `Description must be at most ${maxLength} characters`,
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
                    {maxLength - descriptionText.length}
                  </span>{" "}
                  characters left
                </p>
              </div>

              <div className="flex items-center gap-4 justify-between w-full space-y-4">
                <AddProjectDropdown
                  onAddMember={handleAddMember}
                  onRemoveMember={handleRemoveMember}
                  selectedMembers={members}
                />
                <div className="mb-4 items-center justify-between w-1/2">
                  {members.length > 0 && (
                    <div className="flex items-center -space-x-[0.525rem]">
                      {members.slice(0, 4).map((member) => (
                        <Image
                          key={member.name}
                          className="ring-background rounded-full ring-2"
                          src={member.src}
                          width={28}
                          height={28}
                          alt={member.name}
                        />
                      ))}
                      <p className="text-xs text-muted-foreground ml-4">
                        {members.length} Members
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
            disabled={isPending}
            aria-busy={isPending}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfileBg({ imageUrl }: { imageUrl?: string }) {
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
    : fallbackBgImage;

  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      initialFiles,
    });

  const file0 = files[0]?.file as File | FileMetadata | undefined;
  const currentImage =
    files[0]?.preview || (file0 && !(file0 instanceof File) ? file0.url : null);

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
            <PiPlusCircleDuotone className="w-24 h-24 text-muted-foreground/60" />
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
