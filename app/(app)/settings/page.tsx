"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecurityTab from "@/features/workspace/settings/SecurityTab";
import ProfileTab from "@/features/workspace/settings/ProfileTab";
import WorkspaceTab from "@/features/workspace/settings/WorkspaceTab";
import BillingTab from "@/features/workspace/settings/BillingTab";
import AdminsTab from "@/features/workspace/settings/AdminsTab";
import { InviteMembersDialog } from "@/features/workspace/settings/InviteMembersDialog";
import UsersTab from "@/features/workspace/settings/UsersTab";
import {
  PiUserDuotone,
  PiBriefcaseDuotone,
  PiUsersDuotone,
  PiUserGearDuotone,
  PiShieldCheckDuotone,
  PiCreditCardDuotone,
} from "react-icons/pi";

function SettingsPage() {
  return (
    <div className="flex flex-col gap-2 p-2">
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
            <TabsTrigger value="profile">
              <PiUserDuotone className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="workspace">
              <PiBriefcaseDuotone className="mr-2 h-4 w-4" />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="users">
              <PiUsersDuotone className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="admins">
              <PiUserGearDuotone className="mr-2 h-4 w-4" />
              Admins
            </TabsTrigger>
            <TabsTrigger value="security">
              <PiShieldCheckDuotone className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing">
              <PiCreditCardDuotone className="mr-2 h-4 w-4" />
              Billing
            </TabsTrigger>
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
