"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useOnboardUser } from "@/hooks/onboarding/useOnboardUser";
import { useGetUser } from "@/hooks/user/useGetUser";
import { uploadFiles } from "@/utils/uploadthing";
import { PiImageDuotone, PiXDuotone } from "react-icons/pi";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

type UserFormValues = {
  profileAvatar?: string;
  name: string;
  email: string;
  designation: string;
  location?: string;
  phone?: string;
};

export default function OnboardUserPage() {
  const auth = useAuth();
  const { mutate: onboardUser, isPending } = useOnboardUser();
  const { data: userData } = useGetUser();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const userProfile = userData?.user;

  console.log("userProfile", userProfile);
  console.log("auth", auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<UserFormValues>({
    mode: "onChange",
  });

  const profileAvatar = watch("profileAvatar");
  const currentAvatar = avatarPreview || profileAvatar;

  const onSubmit = (values: UserFormValues) => {
    try {
      if (!auth.user?.profile)
        throw new Error("You are not authorized to perform this action");

      onboardUser({ ...values, user_id: userProfile?._id });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating your profile");
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top brand bar */}
      <header className="w-full flex items-center justify-between px-8 py-4 border-b bg-background/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Uprevit"
            width={28}
            height={28}
            className="h-10 w-10"
          />
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight">
              Complete your profile
            </span>
            <span className="text-xs text-muted-foreground">
              Set up your account to start collaborating on medical device
              labeling.
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl grid grid-cols-1 gap-8">
          {/* Left: Form */}
          <Card className="border border-border/80 shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Welcome to Uprevit
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Your workspace connects teams, departments, projects, and
                products into a single source of truth for compliant medical
                device labeling.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {/* Profile Avatar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <FieldLabel htmlFor="profile-avatar">
                      Profile picture
                    </FieldLabel>
                    <span className="text-[10px] text-muted-foreground">
                      Optional
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={currentAvatar || ""}
                          alt="Profile avatar"
                        />
                        <AvatarFallback className="text-lg bg-white border border-border">
                          {`${userProfile?.name?.split(" ")[0]?.slice(0, 1)}${
                            userProfile?.name?.split(" ")[1]
                              ? userProfile?.name
                                  ?.split(" ")[1]
                                  ?.slice(0, 1)
                                  ?.toUpperCase()
                              : ""
                          }`}
                        </AvatarFallback>
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
                          asChild
                        >
                          <span>
                            <ImagePlusIcon className="w-4 h-4 mr-2" />
                            {uploadingAvatar ? "Uploading..." : "Change Avatar"}
                          </span>
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

                {/* Full Name */}
                <Field>
                  <FieldLabel htmlFor="name">Full name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    defaultValue={userProfile?.name || ""}
                    {...register("name", {
                      required: "Full name is required",
                      maxLength: {
                        value: 80,
                        message: "Full name must be at most 80 characters",
                      },
                    })}
                  />
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    disabled
                    defaultValue={userProfile?.email || ""}
                    {...register("email")}
                  />
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </Field>

                {/* Role / Designation */}
                <Field>
                  <FieldLabel htmlFor="designation">
                    Role / Designation
                  </FieldLabel>
                  <Input
                    id="designation"
                    placeholder="Enter your role or designation"
                    {...register("designation", {
                      required: "Role / Designation is required",
                      maxLength: {
                        value: 120,
                        message:
                          "Role / Designation must be at most 120 characters",
                      },
                    })}
                  />
                  {errors.designation && (
                    <FieldError>{errors.designation.message}</FieldError>
                  )}
                </Field>

                {/* Location */}
                <Field>
                  <FieldLabel htmlFor="location">Location</FieldLabel>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      Optional
                    </span>
                  </div>
                  <Input
                    id="location"
                    placeholder="Enter your location"
                    defaultValue={userProfile?.location || ""}
                    {...register("location", {
                      maxLength: {
                        value: 240,
                        message: "Location must be at most 240 characters",
                      },
                    })}
                  />
                  {errors.location && (
                    <FieldError>{errors.location.message}</FieldError>
                  )}
                </Field>

                {/* Phone Number */}
                <Field>
                  <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      Optional
                    </span>
                  </div>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    defaultValue={userProfile?.phone || ""}
                    {...register("phone", {
                      maxLength: {
                        value: 80,
                        message: "Phone number must be at most 80 characters",
                      },
                    })}
                  />
                  {errors.phone && (
                    <FieldError>{errors.phone.message}</FieldError>
                  )}
                </Field>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3">
                  <Button
                    type="submit"
                    disabled={!isValid || isPending}
                    className="px-6"
                  >
                    {isPending ? "Creating profile..." : "Create profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Right: Contextual panel */}
          <Card className="hidden lg:flex flex-col justify-between border border-border/80 bg-muted/40">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Complete your profile
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Your workspace connects teams, departments, projects, and
                products into a single source of truth for compliant medical
                device labeling.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-xs text-muted-foreground">
              <div className="space-y-1.5">
                <p className="font-medium text-foreground">
                  After creating your profile
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Invite collaborators to join your organization.</li>
                  <li>
                    Create departments and projects for each product line.
                  </li>
                  <li>
                    Upload source files and manage label content centrally.
                  </li>
                </ul>
              </div>
              <div className="space-y-1.5">
                <p className="font-medium text-foreground">Safe to iterate</p>
                <p>
                  All details here can be updated anytime from Settings without
                  impacting your existing projects or audit history.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
