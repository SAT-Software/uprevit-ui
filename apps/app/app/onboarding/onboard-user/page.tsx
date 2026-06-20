"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { OnboardingShell } from "@/components/onboarding-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@uprevit/ui/components/ui/avatar";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@uprevit/ui/components/ui/card";
import { FieldError, FieldLabel } from "@uprevit/ui/components/ui/field";
import { InputGroup, InputGroupInput } from "@uprevit/ui/components/ui/input-group";
import { Label } from "@uprevit/ui/components/ui/label";
import { useOnboardUser } from "@/hooks/onboarding/useOnboardUser";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { useGetUser } from "@/hooks/user/useGetUser";
import { resolveAssetUrl } from "@/utils/resolveAssetUrl";
import { isWorkspaceAccessFrozenError } from "@/utils/workspaceAccessErrors";
import { WorkspaceAccessFrozenScreen } from "@/components/common/WorkspaceAccessFrozenScreen";
import { ArrowRightIcon, ImagePlusIcon, XIcon } from "lucide-react";
import { useAuth } from "react-oidc-context";
import { PiUserCircleDuotone } from "react-icons/pi";
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
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();
  const { data: userData, error: userError } = useGetUser();
  const isAccessFrozen = isWorkspaceAccessFrozenError(userError);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [profileAvatarSizeBytes, setProfileAvatarSizeBytes] = useState<
    number | undefined
  >();

  const userProfile = userData?.user;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = useForm<UserFormValues>({
    mode: "onChange",
    defaultValues: {
      profileAvatar: "",
      name: "",
      email: "",
      designation: "",
      location: "",
      phone: "",
    },
  });

  const existingProfileAvatarValue =
    typeof userProfile?.profileAvatarKey === "string"
      ? userProfile.profileAvatarKey
      : typeof userProfile?.profileAvatar === "string"
        ? userProfile.profileAvatar
        : "";

  useEffect(() => {
    if (!userProfile) return;

    reset({
      profileAvatar: existingProfileAvatarValue,
      name: userProfile.name || "",
      email: userProfile.email || "",
      designation: userProfile.designation || "",
      location: userProfile.location || "",
      phone: userProfile.phone || "",
    });
  }, [existingProfileAvatarValue, reset, userProfile]);

  const profileAvatar = watch("profileAvatar");
  const currentAvatar =
    avatarPreview ||
    (profileAvatar
      ? resolveAssetUrl(profileAvatar, userProfile?.profileAvatar)
      : "");
  const inputGroupClass = "bg-background/75 shadow-none";

  if (isAccessFrozen) {
    return <WorkspaceAccessFrozenScreen />;
  }

  const onSubmit = (values: UserFormValues) => {
    try {
      if (!auth.user?.profile)
        throw new Error("You are not authorized to perform this action");

      onboardUser({
        ...values,
        user_id: userProfile?._id,
        profileAvatarSizeBytes,
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating your profile");
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      const uploadResult = await uploadFileToS3({ file });
      setValue("profileAvatar", uploadResult.key, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setProfileAvatarSizeBytes(uploadResult.size);
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      setAvatarPreview("");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const removeAvatar = () => {
    setValue("profileAvatar", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setAvatarPreview("");
    setProfileAvatarSizeBytes(undefined);
  };

  return (
    <OnboardingShell
      title="Complete your profile"
      description="Set up your profile so teammates can identify ownership and collaborate across labeling workflows."
    >
      <div className="mx-auto w-full max-w-3xl">
        <Card className="border from-background/95 to-background/80 shadow-[0_28px_80px_-52px_hsl(var(--foreground)/0.55)] ring-1 ring-border/45 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-semibold tracking-tight">
              Your profile
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Add your role and contact details to keep reviews, approvals, and
              collaboration clear for everyone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <input type="hidden" {...register("profileAvatar")} />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel htmlFor="profile-avatar">
                    Profile picture
                  </FieldLabel>
                  <span className="text-[10px] text-muted-foreground">
                    Optional
                  </span>
                </div>
                <div className="flex items-center gap-4 rounded-xl bg-muted/35 p-3 ring-1 ring-border/50">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={currentAvatar || ""}
                        alt="Profile avatar"
                      />
                      <AvatarFallback className="border border-border bg-muted text-muted-foreground">
                        <PiUserCircleDuotone className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    {uploadingAvatar && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
                        onChange={handleAvatarChange}
                        disabled={uploadingAvatar}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
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
                          <ImagePlusIcon className="mr-2 h-4 w-4" />
                          {uploadingAvatar ? "Uploading..." : "Change Avatar"}
                        </span>
                      </Button>
                    </div>

                    {profileAvatar && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeAvatar}
                        disabled={uploadingAvatar}
                        className="w-fit text-destructive hover:text-destructive"
                      >
                        <XIcon className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <InputGroup className={inputGroupClass}>
                    <InputGroupInput
                      id="name"
                      placeholder="Enter your full name"
                      className="h-10"
                      aria-invalid={Boolean(errors.name)}
                      {...register("name", {
                        required: "Full name is required",
                        maxLength: {
                          value: 80,
                          message: "Full name must be at most 80 characters",
                        },
                      })}
                    />
                  </InputGroup>
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <InputGroup className={inputGroupClass}>
                    <InputGroupInput
                      id="email"
                      placeholder="Enter your email"
                      className="h-10"
                      disabled
                      aria-invalid={Boolean(errors.email)}
                      {...register("email")}
                    />
                  </InputGroup>
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Role / Designation</Label>
                <InputGroup className={inputGroupClass}>
                  <InputGroupInput
                    id="designation"
                    placeholder="Enter your role or designation"
                    className="h-10"
                    aria-invalid={Boolean(errors.designation)}
                    {...register("designation", {
                      required: "Role / Designation is required",
                      maxLength: {
                        value: 120,
                        message:
                          "Role / Designation must be at most 120 characters",
                      },
                    })}
                  />
                </InputGroup>
                {errors.designation && (
                  <FieldError>{errors.designation.message}</FieldError>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="location">Location</Label>
                    <span className="text-[10px] text-muted-foreground">
                      Optional
                    </span>
                  </div>
                  <InputGroup className={inputGroupClass}>
                    <InputGroupInput
                      id="location"
                      placeholder="Enter your location"
                      className="h-10"
                      aria-invalid={Boolean(errors.location)}
                      {...register("location", {
                        maxLength: {
                          value: 240,
                          message: "Location must be at most 240 characters",
                        },
                      })}
                    />
                  </InputGroup>
                  {errors.location && (
                    <FieldError>{errors.location.message}</FieldError>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <span className="text-[10px] text-muted-foreground">
                      Optional
                    </span>
                  </div>
                  <InputGroup className={inputGroupClass}>
                    <InputGroupInput
                      id="phone"
                      placeholder="Enter your phone number"
                      className="h-10"
                      aria-invalid={Boolean(errors.phone)}
                      {...register("phone", {
                        maxLength: {
                          value: 80,
                          message: "Phone number must be at most 80 characters",
                        },
                      })}
                    />
                  </InputGroup>
                  {errors.phone && (
                    <FieldError>{errors.phone.message}</FieldError>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={!isValid || isPending || uploadingAvatar}
                  className="gap-2 px-6"
                >
                  {uploadingAvatar ? (
                    "Uploading avatar..."
                  ) : isPending ? (
                    "Creating profile..."
                  ) : (
                    <>
                      Create profile
                      <ArrowRightIcon className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </OnboardingShell>
  );
}
