"use client";

import { useRef, useState, useId } from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@uprevit/ui/components/ui/avatar";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";
import { useForm, SubmitHandler } from "react-hook-form";
import { User } from "@/types/user";
import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Delete02Icon,
  UploadSquare01Icon,
  UserEdit01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";
import { resolveAssetUrl } from "@/utils/resolveAssetUrl";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { toast } from "sonner";

const PROFILE_AVATAR_ACCEPT =
  "image/png,image/jpg,image/jpeg,image/gif,image/webp";
const PROFILE_AVATAR_MAX_SIZE = 500 * 1024;
const PROFILE_AVATAR_HELPER_TEXT =
  "Supports PNG, JPEG, JPG, GIF, WEBP (under 500KB)";

interface DialogUpdateProfileProps {
  userProfile: User;
}

export function DialogUpdateProfile({ userProfile }: DialogUpdateProfileProps) {
  const id = useId();
  const uploadId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formId = `update-user-profile-form-${id}`;
  const [open, setOpen] = useState(false);
  const { mutate: updateUserMutation, isPending } = useUpdateUser();
  const { mutateAsync: uploadFileToS3 } = useUploadFilesToS3();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [profileAvatarSizeBytes, setProfileAvatarSizeBytes] = useState<
    number | undefined
  >();
  const [avatarUploadedThisSession, setAvatarUploadedThisSession] =
    useState(false);
  const existingProfileAvatarValue =
    typeof userProfile?.profileAvatarKey === "string"
      ? userProfile.profileAvatarKey
      : userProfile?.profileAvatar;

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
      profileAvatar: existingProfileAvatarValue,
    },
  });

  const resetUploadSessionState = () => {
    setProfileAvatarSizeBytes(undefined);
    setAvatarUploadedThisSession(false);
    setAvatarPreview("");
  };

  const onSubmit: SubmitHandler<User> = async (formData) => {
    try {
      const payload = avatarUploadedThisSession
        ? { ...formData, profileAvatarSizeBytes }
        : formData;

      updateUserMutation(payload as Partial<User>, {
        onSuccess: () => {
          resetUploadSessionState();
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
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > PROFILE_AVATAR_MAX_SIZE) {
      toast.error("Profile picture must be under 500KB.");
      event.target.value = "";
      return;
    }

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
      setAvatarUploadedThisSession(true);
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      setAvatarPreview("");
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
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
    setAvatarUploadedThisSession(false);
  };

  const profileAvatarValue = watch("profileAvatar");
  const currentAvatar =
    avatarPreview ||
    (profileAvatarValue
      ? resolveAssetUrl(profileAvatarValue, userProfile?.profileAvatar)
      : "");

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      resetUploadSessionState();
    }
  };

  const initials = userProfile?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Icon icon={UserEdit01Icon} size={14} strokeWidth={2} />
          Edit Profile
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Edit Profile"
        description="Update your profile picture and personal information."
        variant="form"
        size="xl"
        primaryAction={{
          label: "Save Changes",
          loadingLabel: "Saving...",
          form: formId,
          type: "submit",
          loading: isPending,
          disabled: isPending || uploadingAvatar,
          icon: CheckmarkCircle01Icon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending || uploadingAvatar,
          icon: Cancel01Icon,
        }}
      >
        <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
          <input type="hidden" {...register("profileAvatar")} />
          <FieldGroup className="gap-6 p-4">
            <div className="flex items-start gap-4">
              <div className="relative size-20 shrink-0">
                <Avatar className="size-20 ring-2 ring-background">
                  <AvatarImage src={currentAvatar} alt="Profile avatar" />
                  <AvatarFallback className="border text-lg">
                    {initials || "AV"}
                  </AvatarFallback>
                </Avatar>

                {uploadingAvatar ? (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <Spinner />
                  </div>
                ) : null}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <FormFieldLabel
                  htmlFor={uploadId}
                  label="Profile Picture"
                  tooltip="Update or remove the image shown on your profile."
                  optional
                />

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingAvatar}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icon icon={UploadSquare01Icon} size={14} strokeWidth={2} />
                    Upload Image
                  </Button>

                  {currentAvatar ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={uploadingAvatar}
                      onClick={removeAvatar}
                    >
                      <Icon icon={Delete02Icon} size={14} strokeWidth={2} />
                      Remove
                    </Button>
                  ) : null}
                </div>

                <p className="text-[11px] leading-relaxed text-muted-foreground/70">
                  {PROFILE_AVATAR_HELPER_TEXT}
                </p>
              </div>

              <input
                ref={fileInputRef}
                id={uploadId}
                type="file"
                accept={PROFILE_AVATAR_ACCEPT}
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
                className="sr-only"
                aria-label="Upload profile picture"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field data-invalid={!!errors.name}>
                <FormFieldLabel
                  htmlFor={`${id}-name`}
                  label="Full Name"
                  tooltip="Your name as it appears across the workspace."
                />
                <InputGroup size="md" className="bg-background">
                  <InputGroupInput
                    id={`${id}-name`}
                    type="text"
                    placeholder="Enter your full name"
                    aria-invalid={errors.name ? "true" : "false"}
                    {...register("name", {
                      required: "Full name is required",
                    })}
                  />
                </InputGroup>
                <FieldError errors={[errors.name]} />
              </Field>

              <Field data-invalid={!!errors.email}>
                <FormFieldLabel
                  htmlFor={`${id}-email`}
                  label="Email Address"
                  tooltip="The email address associated with your account."
                />
                <InputGroup size="md" className="bg-background">
                  <InputGroupInput
                    id={`${id}-email`}
                    type="email"
                    placeholder="Enter your email"
                    aria-invalid={errors.email ? "true" : "false"}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </InputGroup>
                <FieldError errors={[errors.email]} />
              </Field>

              <Field data-invalid={!!errors.designation}>
                <FormFieldLabel
                  htmlFor={`${id}-designation`}
                  label="Role / Designation"
                  tooltip="Your job title or role within the organization."
                />
                <InputGroup size="md" className="bg-background">
                  <InputGroupInput
                    id={`${id}-designation`}
                    type="text"
                    placeholder="Enter your role"
                    aria-invalid={errors.designation ? "true" : "false"}
                    {...register("designation", {
                      required: "Designation is required",
                    })}
                  />
                </InputGroup>
                <FieldError errors={[errors.designation]} />
              </Field>

              <Field>
                <FormFieldLabel
                  htmlFor={`${id}-location`}
                  label="Location"
                  tooltip="Your city, region, or office location."
                  optional
                />
                <InputGroup size="md" className="bg-background">
                  <InputGroupInput
                    id={`${id}-location`}
                    type="text"
                    placeholder="Enter your location"
                    {...register("location")}
                  />
                </InputGroup>
              </Field>

              <Field>
                <FormFieldLabel
                  htmlFor={`${id}-phone`}
                  label="Phone Number"
                  tooltip="Your contact phone number."
                  optional
                />
                <InputGroup size="md" className="bg-background">
                  <InputGroupInput
                    id={`${id}-phone`}
                    type="tel"
                    placeholder="Enter your phone number"
                    {...register("phone")}
                  />
                </InputGroup>
              </Field>
            </div>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}
