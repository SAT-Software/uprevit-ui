"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetUser } from "@/hooks/user/useGetUser";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";
import { useForm, SubmitHandler } from "react-hook-form";
import { useId } from "react";
import { User } from "@/types/user";

function ProfileTab() {
  const id = useId();
  const { data, isLoading, error } = useGetUser("68d2b37127794dcb43a32425"); // The id should come from user session token
  const { mutate: updateUserMutation, isPending } = useUpdateUser();

  const userProfile = data?.user;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    defaultValues: {
      name: userProfile?.name || "",
      profileAvatar: userProfile?.profile_avatar || "",
      designation: userProfile?.designation || "",
      email: userProfile?.email || "",
      phone: userProfile?.phone || "",
      location: userProfile?.location || "",
      organization: userProfile?.organization || "",
    },
    mode: "onSubmit",
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error?.message}</div>;

  const onSubmit: SubmitHandler<User> = (formData) => {
    try {
      updateUserMutation(formData);
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-6 p-6 bg-accent rounded-lg border">
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarImage
              src="/avatars/profile-avatar.png"
              alt={userProfile.name}
            />
            <AvatarFallback className="text-lg border">{`${userProfile.name
              .split(" ")[0]
              .slice(0, 1)}${userProfile.name
              .split(" ")[1]
              .slice(0, 1)
              .toUpperCase()}`}</AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 16v-4m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-semibold">{userProfile.name}</h2>
            <Badge variant="default">{userProfile.userType}</Badge>
          </div>
          <p className="text-muted-foreground">
            Update your profile information and preferences.
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <form
        id="update-user-profile-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <div className="font-medium">Personal Information</div>

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
            <label className="text-sm font-medium">Organization</label>
            <Input
              type="text"
              placeholder="Enter your organization"
              className="w-full"
              {...register("organization", {
                required: "Organization is required",
              })}
            />
            {errors.organization && (
              <p role="alert" className="text-xs text-destructive">
                {errors.organization.message}
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
          <Button variant="outline">Cancel</Button>
          <Button type="submit" disabled={isPending} variant="default">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {/* Profile Preferences */}
      {/* <div className="space-y-4">
        <div className="font-medium">Profile Preferences</div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">Profile Visibility</div>
              <div className="text-sm text-muted-foreground">
                Control who can see your profile information.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select className="px-3 py-2 border border-input bg-background rounded-md text-sm">
                <option>Public</option>
                <option>Workspace Only</option>
                <option>Private</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-muted-foreground">
                Receive email updates about your account activity.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-primary/20 rounded-full relative">
                <div className="absolute left-5 top-0.5 w-5 h-5 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium">Activity Status</div>
              <div className="text-sm text-muted-foreground">
                Show when you&apos;re active and available.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-primary/20 rounded-full relative">
                <div className="absolute left-5 top-0.5 w-5 h-5 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Account Statistics */}
      {/* <div className="space-y-4">
        <div className="font-medium">Account Statistics</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-semibold">127</div>
            <div className="text-sm text-muted-foreground">
              Products Created
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-semibold">23</div>
            <div className="text-sm text-muted-foreground">
              Projects Completed
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-semibold">2.5</div>
            <div className="text-sm text-muted-foreground">Years Active</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default ProfileTab;
