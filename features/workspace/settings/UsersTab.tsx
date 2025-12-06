"use client";

import { useGetWorkspace } from "@/hooks/workspace/useGetWorkspace";
import { UsersTable } from "./UsersTable";
import { InviteMembersDialog } from "./InviteMembersDialog";
import { useGetAllUsersByWorkspace } from "@/hooks/user/useGetAllUsersByWorkspace";

const UsersTab = () => {
  const { data: workspaceData, isLoading } = useGetAllUsersByWorkspace();

  if (!isLoading) console.log(workspaceData);

  return (
    <div>
      <div className="flex items-center gap-6 px-6 py-4 bg-accent rounded-lg border mb-6">
        <p className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl border border-border font-bold bg-white rounded-full w-20 h-20 flex items-center justify-center">
          {workspaceData?.data?.length}
        </p>

        <div className="flex-1">
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-semibold">
              {workspaceData?.data?.length === 1 ? "User" : "Users"}
            </h2>
          </div>
          <p className="text-muted-foreground">Manage your workspace users</p>
        </div>
        <InviteMembersDialog />
      </div>

      <UsersTable />
    </div>
  );
};

export default UsersTab;
