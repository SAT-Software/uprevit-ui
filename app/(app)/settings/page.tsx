"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecurityTab from "@/features/workspace/settings/SecurityTab";
import ProfileTab from "@/features/workspace/settings/ProfileTab";
import WorkspaceTab from "@/features/workspace/settings/WorkspaceTab";
import BillingTab from "@/features/workspace/settings/BillingTab";
import AdminsTab from "@/features/workspace/settings/AdminsTab";
import { InviteMembersDialog } from "@/features/workspace/settings/InviteMembersDialog";
import UsersTab from "@/features/workspace/settings/UsersTab";

function SettingsPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="border border-input bg-background rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <InviteMembersDialog />
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="border border-input bg-background rounded-xl p-4">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="workspace" className="mt-6">
            <WorkspaceTab />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UsersTab />
          </TabsContent>

          <TabsContent value="admins" className="mt-6">
            <AdminsTab />
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <SecurityTab />
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            <BillingTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default SettingsPage;
