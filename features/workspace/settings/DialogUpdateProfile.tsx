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
} from "@/components/ui/dialog";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";
import { useForm, SubmitHandler } from "react-hook-form";
import { User } from "@/types/user";
import { uploadFiles } from "@/utils/uploadthing";
import { ImagePlusIcon, XIcon, PencilIcon } from "lucide-react";

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
        <Button variant="outline" size="sm">
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form
          id="update-user-profile-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Profile Avatar</label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={currentAvatar} alt="Profile avatar" />
                  <AvatarFallback className="text-lg border">AV</AvatarFallback>
                </Avatar>
                {uploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploadingAvatar}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Upload profile avatar"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingAvatar}
                    className="w-fit cursor-pointer"
                  >
                    <ImagePlusIcon className="w-4 h-4 mr-2" />
                    {uploadingAvatar ? "Uploading..." : "Change Avatar"}
                  </Button>
                </div>

                {watch("profileAvatar") && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAvatar}
                    disabled={uploadingAvatar}
                    className="w-fit text-destructive hover:text-destructive"
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
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
              <label className="text-sm font-medium">Role / Designation</label>
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

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} variant="default">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
