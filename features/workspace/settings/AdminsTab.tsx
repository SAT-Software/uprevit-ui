"use client";

import { useMemo } from "react";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
import { AdminsTable } from "./AdminsTable";
import { User } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { PiWarningCircleDuotone } from "react-icons/pi";

const AdminsTab = () => {
  const { data: responseData, isLoading, error } = useGetAllUsersByWorkspace();

  const adminsCount = useMemo(() => {
    const users = responseData?.data ?? [];
    return users.filter((user: User) => user.userType === "admin").length;
  }, [responseData]);

  if (isLoading) {
    return (
      <div>
        {/* Header Skeleton */}
        <div className="flex items-center gap-6 px-6 py-4 bg-accent rounded-lg border mb-6">
          <Skeleton className="w-20 h-20 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-52" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="border rounded-lg">
          {/* Table Header */}
          <div className="flex items-center gap-4 p-4 border-b bg-muted/30">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20 ml-auto" />
          </div>
          {/* Table Rows */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border-b last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-md ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-4 p-4 border border-destructive/30 rounded-lg bg-destructive/5">
        <div className="p-2.5 bg-destructive/10 rounded-lg shrink-0">
          <PiWarningCircleDuotone className="w-5 h-5 text-destructive" />
        </div>
        <div className="space-y-0.5">
          <div className="text-sm font-medium">Failed to load admins</div>
          <div className="text-sm text-muted-foreground">
            {error?.message || "An unexpected error occurred"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-6 px-6 py-4 bg-accent rounded-lg border mb-6">
        <p className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl border border-border font-bold bg-white rounded-full w-20 h-20 flex items-center justify-center">
          {adminsCount}
        </p>

        <div className="flex-1">
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-semibold">
              {adminsCount === 1 ? "Admin" : "Admins"}
            </h2>
          </div>
          <p className="text-muted-foreground">Manage your workspace admins</p>
        </div>
      </div>

      <AdminsTable />
    </div>
  );
};

export default AdminsTab;
