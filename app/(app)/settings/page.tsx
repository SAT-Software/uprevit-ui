"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecurityTab from "@/features/settings/SecurityTab";
import ProfileTab from "@/features/settings/ProfileTab";
import WorkspaceTab from "@/features/settings/WorkspaceTab";
import BillingTab from "@/features/settings/BillingTab";
import MembersTab from "@/features/settings/MembersTab";
import { InviteMembersDialog } from "@/features/settings/InviteMembersDialog";

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
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="workspace" className="mt-6">
            <WorkspaceTab />
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <MembersTab />
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
