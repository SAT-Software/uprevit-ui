"use client";

import { useState } from "react";
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
import BillingTab from "@/features/workspace/settings/BillingTab";
import AdminsTab from "@/features/workspace/settings/AdminsTab";
import { InviteMembersDialog } from "@/features/workspace/settings/InviteMembersDialog";
import UsersTab from "@/features/workspace/settings/UsersTab";
import {
  Timer01Icon,
  DashboardSquare01Icon,
  UserIcon,
  UserGroupIcon,
  UserShield01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ThemeToggle } from "@uprevit/ui/components/common/ThemeToggle";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { toast } from "sonner";

const LIST_QUERY_PARAMS = ["page", "limit", "sort", "order", "filters"];

function SettingsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab = tabParam;
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);
  const adminTabs = ["admins", "workspace", "usage", "security"];
  const resolvedTab = tab === "billing" ? "usage" : tab;
  const activeTab =
    resolvedTab && (!adminTabs.includes(resolvedTab) || isAdmin)
      ? resolvedTab
      : "profile";
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [syncedActiveTab, setSyncedActiveTab] = useState(activeTab);

  if (activeTab !== syncedActiveTab) {
    setSyncedActiveTab(activeTab);
    setPendingTab(null);
  }

  const tabValue = pendingTab ?? activeTab;

  const handleTabChange = (value: string) => {
    if (adminTabs.includes(value) && !isAdmin) {
      toast.error("Insufficient privileges, contact Admin");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    for (const key of LIST_QUERY_PARAMS) {
      params.delete(key);
    }
    setPendingTab(value);
    params.set("tab", value);
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Settings</p>
          <InfoTooltip content="Manage your account settings and preferences." />
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <InviteMembersDialog />
        </div>
      </div>

      <Tabs
        value={tabValue}
        onValueChange={handleTabChange}
        className="flex min-h-0 flex-1 flex-col overflow-hidden gap-0"
      >
        <div className="flex h-10 shrink-0 items-center border-b border-border px-2">
          <TabsList variant="line">
            <TabsTrigger value="profile">
              <Icon icon={UserIcon} size={14} strokeWidth={2} />
              Profile
            </TabsTrigger>
            <TabsTrigger value="workspace">
              <Icon icon={DashboardSquare01Icon} size={14} strokeWidth={2} />
              Workspace
            </TabsTrigger>
            <TabsTrigger value="users">
              <Icon icon={UserGroupIcon} size={14} strokeWidth={2} />
              Users
            </TabsTrigger>
            <TabsTrigger value="admins">
              <Icon icon={UserShield01Icon} size={14} strokeWidth={2} />
              Admins
            </TabsTrigger>
            {isAdmin ? (
              <>
                <TabsTrigger value="usage">
                  <Icon icon={Timer01Icon} size={14} strokeWidth={2} />
                  Usage
                </TabsTrigger>
                {/* <TabsTrigger value="billing">
                  <PiCreditCardDuotone className="mr-2 h-4 w-4" />
                  Billing
                </TabsTrigger> */}
              </>
            ) : null}
          </TabsList>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <TabsContent value="profile" className="mt-0">
            {activeTab === "profile" && <ProfileTab />}
          </TabsContent>

          <TabsContent value="workspace" className="mt-0">
            {activeTab === "workspace" && <WorkspaceTab />}
          </TabsContent>

          <TabsContent value="users" className="mt-0">
            {activeTab === "users" && <UsersTab />}
          </TabsContent>

          <TabsContent value="admins" className="mt-0">
            {activeTab === "admins" && <AdminsTab />}
          </TabsContent>

          <TabsContent value="usage" className="mt-0">
            {activeTab === "usage" && <UsageTab />}
          </TabsContent>

          {/* Billing Tab is kept hidden, it is disabled for now. Later on we will add new user group as manager which is not billed who can only handle this billing tab and can't do any other activities*/}
          {/* <TabsContent value="billing" className="mt-6">
            {activeTab === "billing" && <BillingTab />}
          </TabsContent> */}
        </div>
      </Tabs>
    </div>
  );
}

export default SettingsPage;
