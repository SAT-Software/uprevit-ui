/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
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
import { PiCirclesThreePlusDuotone } from "react-icons/pi";
import Image from "next/image";
import AddDepartmentDropdown from "./AddMemberInDepartmentDropdown";
import { useCreateDepartment } from "@/hooks/department/useCreateDepartment";
import type { FileMetadata } from "@/hooks/general/use-file-upload";

interface Member {
  name: string;
  src: string;
}

type FormValues = {
  department_name: string;
  manager?: string;
  department_description: string;
};

export default function DialogAddDepartment() {
  const id = useId();

  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);

  const { mutate: createDepartment, isPending } = useCreateDepartment();
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;
  const workspaceId = auth?.user?.profile?.workspaceId;

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

  const handleAddMember = (member: Member) => {
    if (!members.some((m) => m.name === member.name)) {
      setMembers([...members, member]);
    }
  };

  const handleRemoveMember = (member: Member) => {
    setMembers(members.filter((m) => m.name !== member.name));
  };

  function onSubmit(data: FormValues) {
    createDepartment(
      {
        department_name: data.department_name,
        department_description: data.department_description,
        manager: data.manager,
        users: members.map((member) => member.name),
        image: "",
        admin_id: userId as string,
        workspace_id: workspaceId as string,
      },
      {
        onSuccess: () => {
          reset();
          setMembers([]);
          setOpen(false);
        },
        onError: (error) => {
          console.error("Error creating department:", error);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          Create New Department
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Create New Department
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
          <div className="flex gap-4 px-6 pt-4">
            <div className="w-1/3">
              <ProfileBg />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-4">
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
              <div className="space-y-4">
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

          <div className="px-6 pt-4 pb-6">
            <div className="space-y-4">
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
                  aria-invalid={
                    errors.department_description ? "true" : "false"
                  }
                  {...register("department_description", {
                    required: "Description is required",
                    maxLength: {
                      value: 220,
                      message: `Description must be at most 220 characters`,
                    },
                  })}
                />
                {errors.department_description && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.department_description.message}
                  </p>
                )}
                <p
                  id={`${id}-description`}
                  className="text-muted-foreground mt-2 text-right text-xs"
                  role="status"
                  aria-live="polite"
                >
                  <span className="tabular-nums">
                    {220 - (watch("department_description") || "").length}
                  </span>{" "}
                  characters left
                </p>
              </div>

              <div className="flex items-center gap-4 justify-between w-full space-y-4">
                <AddDepartmentDropdown
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
            form={`mutate-department-form-${id}`}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Creating..." : "Create Department"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfileBg() {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
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
