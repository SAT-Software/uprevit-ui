"use client";

import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";
import { useForm, SubmitHandler } from "react-hook-form";
import { User } from "@/types/user";
import { uploadFiles } from "@/utils/uploadthing";
import {
  PiPencilSimpleDuotone,
  PiXCircleDuotone,
  PiCheckCircleDuotone,
  PiCameraDuotone,
  PiTrashDuotone,
} from "react-icons/pi";

interface DialogUpdateProfileProps {
  userProfile: User;
}

export function DialogUpdateProfile({ userProfile }: DialogUpdateProfileProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const { mutate: updateUserMutation, isPending } = useUpdateUser();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<User>({
    mode: "onSubmit",
    defaultValues: {
      name: userProfile?.name,
      email: userProfile?.email,
      designation: userProfile?.designation,
      location: userProfile?.location,
      phone: userProfile?.phone,
      profileAvatar: userProfile?.profileAvatar,
    },
  });

  const onSubmit: SubmitHandler<User> = async (formData) => {
    try {
      updateUserMutation(formData, {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (error) => {
          setOpen(false);
          console.error("Failed to update user profile:", error);
        },
      });
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Upload the file
      const utRes = await uploadFiles("imageUploader", {
        files: [file],
      });

      if (utRes && utRes[0]?.ufsUrl) {
        setValue("profileAvatar", utRes[0].ufsUrl);
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      // Reset preview on error
      setAvatarPreview("");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const removeAvatar = () => {
    setValue("profileAvatar", "");
    setAvatarPreview("");
  };

  const currentAvatar =
    avatarPreview || watch("profileAvatar") || userProfile?.profileAvatar;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <PiPencilSimpleDuotone className="w-4 h-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-[600px] [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Edit Profile</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <form
          id="update-user-profile-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="overflow-y-auto"
        >
          <div className="p-4 space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="w-20 h-20 ring-2 ring-background">
                  <AvatarImage src={currentAvatar} alt="Profile avatar" />
                  <AvatarFallback className="text-lg border">AV</AvatarFallback>
                </Avatar>

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px] rounded-full z-10">
                  <label
                    className="cursor-pointer p-2 bg-background text-foreground rounded-full hover:bg-accent transition-colors flex items-center justify-center"
                    title="Change Avatar"
                  >
                    <PiCameraDuotone size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                  </label>

                  {watch("profileAvatar") && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      disabled={uploadingAvatar}
                      className="cursor-pointer p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors flex items-center justify-center"
                      title="Remove Avatar"
                    >
                      <PiTrashDuotone size={16} />
                    </button>
                  )}
                </div>

                {uploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full z-20">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-medium text-sm">Profile Picture</h3>
                <p className="text-xs text-muted-foreground">
                  Upload a new picture to update your profile.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  id={`${id}-name`}
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full"
                  {...register("name", {
                    required: "Full name is required",
                  })}
                />
                {errors.name && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Role / Designation
                </label>
                <Input
                  type="text"
                  placeholder="Enter your role"
                  className="w-full"
                  {...register("designation", {
                    required: "Designation is required",
                  })}
                />
                {errors.designation && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.designation.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  type="text"
                  placeholder="Enter your location"
                  className="w-full"
                  {...register("location")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full"
                  {...register("phone")}
                />
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              <PiXCircleDuotone className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isPending || uploadingAvatar}
            variant="default"
            size="sm"
            form="update-user-profile-form"
          >
            <PiCheckCircleDuotone className="mr-2 h-4 w-4" />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
