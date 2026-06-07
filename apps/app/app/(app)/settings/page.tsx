"use client";

import { useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@uprevit/ui/components/ui/tabs";
import SecurityTab from "@/features/workspace/settings/SecurityTab";
import ProfileTab from "@/features/workspace/settings/ProfileTab";
import WorkspaceTab from "@/features/workspace/settings/WorkspaceTab";
import UsageTab from "@/features/workspace/settings/UsageTab";
import AdminsTab from "@/features/workspace/settings/AdminsTab";
import { InviteMembersDialog } from "@/features/workspace/settings/InviteMembersDialog";
import UsersTab from "@/features/workspace/settings/UsersTab";
import {
  PiUserDuotone,
  PiBriefcaseDuotone,
  PiUsersDuotone,
  PiUserGearDuotone,
  PiShieldCheckDuotone,
  PiChartBarDuotone,
} from "react-icons/pi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ThemeToggle } from "@uprevit/ui/components/common/ThemeToggle";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { toast } from "sonner";

const LIST_QUERY_PARAMS = ["page", "limit", "sort", "order", "filters"];

function SettingsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab = tabParam === "billing" ? "usage" : tabParam;
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);
  const adminTabs = ["admins", "workspace", "usage", "security"];
  const activeTab =
    tab && (!adminTabs.includes(tab) || isAdmin) ? tab : "profile";

  useEffect(() => {
    if (tabParam !== "billing") return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "usage");
    router.replace(`${pathname}?${params.toString()}`);
  }, [tabParam, searchParams, pathname, router]);

  const handleTabChange = (value: string) => {
    if (adminTabs.includes(value) && !isAdmin) {
      toast.error("Insufficient privileges, contact Admin");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    for (const key of LIST_QUERY_PARAMS) {
      params.delete(key);
    }
    params.set("tab", value);
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  };

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
            <ThemeToggle />
            <InviteMembersDialog />
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="border border-input bg-background rounded-xl p-4">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
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
            {isAdmin ? (
              <TabsTrigger value="usage">
                <PiChartBarDuotone className="mr-2 h-4 w-4" />
                Usage
              </TabsTrigger>
            ) : null}
            {/* <TabsTrigger value="security">
              <PiShieldCheckDuotone className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            {activeTab === "profile" && <ProfileTab />}
          </TabsContent>

          <TabsContent value="workspace" className="mt-6">
            {activeTab === "workspace" && <WorkspaceTab />}
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            {activeTab === "users" && <UsersTab />}
          </TabsContent>

          <TabsContent value="admins" className="mt-6">
            {activeTab === "admins" && <AdminsTab />}
          </TabsContent>

          <TabsContent value="usage" className="mt-6">
            {activeTab === "usage" && <UsageTab />}
          </TabsContent>

          {/* <TabsContent value="security" className="mt-6">
            <SecurityTab />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}

export default SettingsPage;
