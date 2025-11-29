"use client";

import { useMemo } from "react";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";
import { AdminsTable } from "./AdminsTable";
import { User } from "@/types/user";

const AdminsTab = () => {
  const { data: responseData } = useGetAllUsersByWorkspace();

  const adminsCount = useMemo(() => {
    const users = responseData?.data ?? [];
    return users.filter((user: User) => user.userType === "admin").length;
  }, [responseData]);

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
