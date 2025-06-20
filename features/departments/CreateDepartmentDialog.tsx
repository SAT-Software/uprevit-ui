"use client";

import { useId, useState } from "react";
import { ImagePlusIcon, XIcon } from "lucide-react";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { useFileUpload } from "@/hooks/use-file-upload";
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
import { PiCirclesThreePlusDuotone, PiPlusBold } from "react-icons/pi";
import Image from "next/image";
import AddDepartmentDropdown from "./AddMemberInDepartmentDropdown";

interface Member {
  name: string;
  src: string;
}

// Pretend we have initial image files
const initialBgImage = [
  {
    name: "department.jpg",
    size: 1528737,
    type: "image/jpeg",
    url: "/department.jpg",
    id: "department-123456789",
  },
];

export default function CreateDepartmentDialog() {
  const id = useId();
  const [members, setMembers] = useState<Member[]>([]);

  const maxLength = 220;
  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength,
    initialValue: "",
  });

  const handleAddMember = (member: Member) => {
    if (!members.some((m) => m.name === member.name)) {
      setMembers([...members, member]);
    }
  };

  const handleRemoveMember = (member: Member) => {
    setMembers(members.filter((m) => m.name !== member.name));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          Create New Department <PiPlusBold />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Create New Department
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Create a new department by providing department details and adding
          members.
        </DialogDescription>
        <div className="overflow-y-auto">
          <div className="flex gap-4 px-6 pt-4">
            <div className="w-1/3">
              <ProfileBg />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-4">
                <Label htmlFor={`${id}-department-name`}>Department Name</Label>
                <Input
                  id={`${id}-department-name`}
                  placeholder="Enter department name"
                  type="text"
                  required
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor={`${id}-manager-name`}>Department Manager</Label>
                <Input
                  id={`${id}-manager-name`}
                  placeholder="Enter manager's name"
                  type="text"
                  required
                />
              </div>
            </div>
          </div>

          <div className="px-6 pt-4 pb-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-description`}>
                  Department Description
                </Label>
                <Textarea
                  id={`${id}-description`}
                  placeholder="Describe the department's purpose and responsibilities"
                  defaultValue={value}
                  maxLength={maxLength}
                  onChange={handleChange}
                  aria-describedby={`${id}-description`}
                  className="h-24 resize-none"
                />
                <p
                  id={`${id}-description`}
                  className="text-muted-foreground mt-2 text-right text-xs"
                  role="status"
                  aria-live="polite"
                >
                  <span className="tabular-nums">{limit - characterCount}</span>{" "}
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
            </form>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">Create Department</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfileBg() {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
      initialFiles: initialBgImage,
    });

  const currentImage = files[0]?.preview || null;

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
                : "Default profile background"
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
