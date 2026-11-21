import type { useWorkspaceAccess } from "@/hooks/user/useWorkspaceAccess";
import {
  Activity01Icon,
  Archive01Icon,
  ArchiveIcon,
  Blockchain03Icon,
  Bookmark01Icon,
  BookOpen02Icon,
  Building03Icon,
  Chart02Icon,
  FileImportIcon,
  Folder02Icon,
  Home04Icon,
  Invoice01Icon,
  KanbanIcon,
  Moon02Icon,
  NewOfficeIcon,
  ShieldUserIcon,
  UserAdd01Icon,
  UserCircleIcon,
  UserMultiple02Icon,
  Wallet01Icon,
  WorkflowIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

type WorkspaceAccess = ReturnType<typeof useWorkspaceAccess>;

export type GlobalSearchCommand = {
  id: string;
  group: "Actions" | "Go to";
  label: string;
  icon: IconSvgElement;
  href?: string;
  keywords?: string;
  allowed?: (access: WorkspaceAccess) => boolean;
};

const isAdmin = (access: WorkspaceAccess) => access.isAdmin;

export const GLOBAL_SEARCH_COMMANDS: GlobalSearchCommand[] = [
  { id: "import-products", group: "Actions", label: "Import products", icon: FileImportIcon, href: "/products/import", keywords: "upload excel csv new", allowed: isAdmin },
  { id: "invite-members", group: "Actions", label: "Invite members", icon: UserAdd01Icon, href: "/settings?tab=users", keywords: "add user people team", allowed: isAdmin },
  { id: "toggle-theme", group: "Actions", label: "Switch light or dark theme", icon: Moon02Icon, keywords: "theme dark light mode appearance" },
  { id: "dashboard", group: "Go to", label: "Dashboard", icon: Home04Icon, href: "/dashboard", keywords: "home overview" },
  { id: "departments", group: "Go to", label: "Departments", icon: NewOfficeIcon, href: "/departments" },
  { id: "projects", group: "Go to", label: "Projects", icon: KanbanIcon, href: "/projects" },
  { id: "products", group: "Go to", label: "Products", icon: Blockchain03Icon, href: "/products" },
  { id: "workflows", group: "Go to", label: "Workflows", icon: WorkflowIcon, href: "/workflows", keywords: "approval review" },
  { id: "source-files", group: "Go to", label: "Source files", icon: Folder02Icon, href: "/source-files", keywords: "documents folders" },
  { id: "bookmarked-products", group: "Go to", label: "Bookmarked products", icon: Bookmark01Icon, href: "/bookmarked-products", keywords: "favorites saved" },
  { id: "archive", group: "Go to", label: "Archive", icon: ArchiveIcon, href: "/archive", keywords: "archived restore" },
  { id: "reports", group: "Go to", label: "Reports", icon: Archive01Icon, href: "/reports", keywords: "query export" },
  { id: "analytics", group: "Go to", label: "Analytics", icon: Chart02Icon, href: "/analytics", keywords: "insights charts" },
  { id: "docs", group: "Go to", label: "Documentation", icon: BookOpen02Icon, href: "/docs", keywords: "help guide docs" },
  { id: "settings-profile", group: "Go to", label: "Profile settings", icon: UserCircleIcon, href: "/settings?tab=profile", keywords: "account me password" },
  { id: "settings-users", group: "Go to", label: "Users", icon: UserMultiple02Icon, href: "/settings?tab=users", keywords: "members people team settings" },
  { id: "settings-admins", group: "Go to", label: "Admins", icon: ShieldUserIcon, href: "/settings?tab=admins", keywords: "settings", allowed: isAdmin },
  { id: "settings-workspace", group: "Go to", label: "Workspace settings", icon: Building03Icon, href: "/settings?tab=workspace", keywords: "company logo workflow prefix", allowed: isAdmin },
  { id: "settings-activity", group: "Go to", label: "Activity log", icon: Activity01Icon, href: "/settings?tab=activity", keywords: "audit logs history settings", allowed: isAdmin },
  { id: "settings-usage", group: "Go to", label: "Usage", icon: Wallet01Icon, href: "/settings?tab=usage", keywords: "seats storage plan settings", allowed: (access) => access.canManageBilling },
  { id: "settings-billing", group: "Go to", label: "Billing", icon: Invoice01Icon, href: "/settings?tab=billing", keywords: "invoices payment subscription plan settings", allowed: (access) => access.isManager },
];

export function filterGlobalSearchCommands(access: WorkspaceAccess, search: string) {
  const words = search.toLowerCase().split(/\s+/).filter(Boolean);
  return GLOBAL_SEARCH_COMMANDS.filter((command) => {
    if (command.allowed && !command.allowed(access)) return false;
    const text = `${command.label} ${command.keywords ?? ""}`.toLowerCase();
    return words.every((word) => text.includes(word));
  });
}
