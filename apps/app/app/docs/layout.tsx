import { AccessEligibilityGuard } from "@/components/common/AccessEligibilityGuard";
import { DocsIcon } from "@/components/docs/DocsIcon";
import { baseOptions } from "@/lib/layout.shared";
import {
  Archive01Icon,
  ArchiveIcon,
  Blockchain03Icon,
  ContractsIcon,
  Bookmark01Icon,
  DoorOpenIcon,
  Download01Icon,
  FileDatabaseIcon,
  Folder02Icon,
  GitBranchIcon,
  Home04Icon,
  Album02Icon,
  KanbanIcon,
  Layout01Icon,
  NewOfficeIcon,
  LayerIcon,
  Presentation01Icon,
  LabelImportantIcon,
  ThreeDViewIcon,
  AiSheetsIcon,
  AiChat02Icon,
  InformationCircleIcon,
  BookOpen01Icon,
  WorkflowIcon,
  BellIcon,
  CustomerSupportIcon,
  Activity01Icon,
  Chart02Icon,
  NewReleasesIcon,
} from "@hugeicons/core-free-icons";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { AskAIPanel, AskAITrigger } from "@/components/glossen";
import { DocsAskAIProvider } from "@/components/docs/DocsAskAIProvider";

import { SentryUserSync } from "@/components/common/SentryUserSync";
import { PostHogSupportSync } from "@/components/common/PostHogSupportSync";
import { DocsSearchDialog } from "@/components/docs/DocsSearchDialog";
import { DocsSidebarFooter } from "@/components/docs/DocsSidebarFooter";
import { RootProvider } from "fumadocs-ui/provider/next";
import { SectionSpacer } from "../../components/layout.client";

export default function DocsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccessEligibilityGuard>
      <SentryUserSync />
      <PostHogSupportSync />
      <RootProvider search={{ SearchDialog: DocsSearchDialog }}>
        <DocsAskAIProvider>
          <DocsLayout
            containerProps={{
              className: "w-full [--fd-layout-width:100%]",
            }}
            themeSwitch={{ enabled: false }}
            tree={{
              name: "Uprevit Docs",
              type: "root",
              children: [
                {
                  name: "Introduction",
                  type: "page",
                  url: "/docs",
                  icon: <DocsIcon icon={DoorOpenIcon} />,
                },
                { type: "separator" },
                {
                  name: "Getting Started",
                  type: "folder",
                  icon: <DocsIcon icon={BookOpen01Icon} />,
                  defaultOpen: true,
                  children: [
                    {
                      name: "Workspace",
                      type: "page",
                      url: "/docs/getting-started/workspace",
                      icon: <DocsIcon icon={Home04Icon} />,
                    },
                    {
                      name: "Departments",
                      type: "page",
                      url: "/docs/getting-started/departments",
                      icon: <DocsIcon icon={NewOfficeIcon} />,
                    },
                    {
                      name: "Projects",
                      type: "page",
                      url: "/docs/getting-started/projects",
                      icon: <DocsIcon icon={KanbanIcon} />,
                    },
                    {
                      name: "Products",
                      type: "page",
                      url: "/docs/getting-started/products",
                      icon: <DocsIcon icon={Blockchain03Icon} />,
                    },
                  ],
                },
                { type: "separator" },
                {
                  name: "Product Documentation",
                  type: "folder",
                  icon: <DocsIcon icon={Blockchain03Icon} />,
                  defaultOpen: true,
                  children: [
                    {
                      name: "Product Overview",
                      type: "page",
                      url: "/docs/product-documentation/product-overview",
                      icon: <DocsIcon icon={ThreeDViewIcon} />,
                    },
                    {
                      name: "Product Information",
                      type: "page",
                      url: "/docs/product-documentation/product-information",
                      icon: <DocsIcon icon={Layout01Icon} />,
                    },
                    {
                      name: "Compliance Information",
                      type: "page",
                      url: "/docs/product-documentation/compliance-information",
                      icon: <DocsIcon icon={ContractsIcon} />,
                    },
                    {
                      name: "Label Components",
                      type: "page",
                      url: "/docs/product-documentation/label-components",
                      icon: <DocsIcon icon={LayerIcon} />,
                    },
                    {
                      name: "Symbols & Graphics",
                      type: "page",
                      url: "/docs/product-documentation/symbols-graphics",
                      icon: <DocsIcon icon={Album02Icon} />,
                    },
                    {
                      name: "Product Specifications",
                      type: "page",
                      url: "/docs/product-documentation/product-specifications",
                      icon: <DocsIcon icon={AiSheetsIcon} />,
                    },
                    {
                      name: "Operational Parameters",
                      type: "page",
                      url: "/docs/product-documentation/operational-parameters",
                      icon: <DocsIcon icon={FileDatabaseIcon} />,
                    },
                    {
                      name: "Label Tags",
                      type: "page",
                      url: "/docs/product-documentation/label-tags",
                      icon: <DocsIcon icon={LabelImportantIcon} />,
                    },
                  ],
                },
                { type: "separator" },
                {
                  name: "Source Files & Bookmarks",
                  type: "folder",
                  icon: <DocsIcon icon={Folder02Icon} />,
                  defaultOpen: true,
                  children: [
                    {
                      name: "Source Files",
                      type: "page",
                      url: "/docs/source-files-bookmarks/source-files",
                      icon: <DocsIcon icon={Folder02Icon} />,
                    },
                    {
                      name: "Bookmarks",
                      type: "page",
                      url: "/docs/source-files-bookmarks/bookmarks",
                      icon: <DocsIcon icon={Bookmark01Icon} />,
                    },
                  ],
                },
                { type: "separator" },
                {
                  name: "Review & Outputs",
                  type: "folder",
                  icon: <DocsIcon icon={Presentation01Icon} />,
                  defaultOpen: true,
                  children: [
                    {
                      name: "Approval Workflows",
                      type: "page",
                      url: "/docs/review-outputs/approval-workflows",
                      icon: <DocsIcon icon={WorkflowIcon} />,
                    },
                    {
                      name: "Notifications",
                      type: "page",
                      url: "/docs/review-outputs/notifications",
                      icon: <DocsIcon icon={BellIcon} />,
                    },
                    {
                      name: "Redlines and Versions",
                      type: "page",
                      url: "/docs/review-outputs/redlines-versions",
                      icon: <DocsIcon icon={GitBranchIcon} />,
                    },
                    {
                      name: "Reports",
                      type: "page",
                      url: "/docs/review-outputs/reports",
                      icon: <DocsIcon icon={Archive01Icon} />,
                    },
                    {
                      name: "Analytics",
                      type: "page",
                      url: "/docs/review-outputs/analytics",
                      icon: <DocsIcon icon={Chart02Icon} />,
                    },
                    {
                      name: "Exports",
                      type: "page",
                      url: "/docs/review-outputs/exports",
                      icon: <DocsIcon icon={Download01Icon} />,
                    },
                    {
                      name: "Archives",
                      type: "page",
                      url: "/docs/review-outputs/archives",
                      icon: <DocsIcon icon={ArchiveIcon} />,
                    },
                  ],
                },
                { type: "separator" },
                {
                  name: "More",
                  type: "folder",
                  icon: <DocsIcon icon={InformationCircleIcon} />,
                  defaultOpen: true,
                  children: [
                    {
                      name: "Ask AI and Privacy",
                      type: "page",
                      url: "/docs/ask-ai",
                      icon: <DocsIcon icon={AiChat02Icon} />,
                    },
                    {
                      name: "Contact Support",
                      type: "page",
                      url: "/docs/support",
                      icon: <DocsIcon icon={CustomerSupportIcon} />,
                    },
                    {
                      name: "System Status",
                      type: "page",
                      url: "/docs/system-status",
                      icon: <DocsIcon icon={Activity01Icon} />,
                    },
                    {
                      name: "Changelog",
                      type: "page",
                      url: "/docs/changelog",
                      icon: <DocsIcon icon={NewReleasesIcon} />,
                    },
                  ],
                },
              ],
            }}
            sidebar={{
              footer: <DocsSidebarFooter />,
              components: {
                Separator: SectionSpacer,
              },
            }}
            {...baseOptions()}
            searchToggle={{ enabled: true }}
          >
            {children}
            <AskAIPanel />
            <AskAITrigger />
          </DocsLayout>
        </DocsAskAIProvider>
      </RootProvider>
    </AccessEligibilityGuard>
  );
}
