import { AccessEligibilityGuard } from "@/components/common/AccessEligibilityGuard";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import {
  PiArchiveDuotone,
  PiBookmarkSimpleDuotone,
  PiBookOpenDuotone,
  PiBuildingsDuotone,
  PiDatabaseDuotone,
  PiExportDuotone,
  PiFolderOpenDuotone,
  PiGitBranchDuotone,
  PiCompassDuotone,
  PiHouseDuotone,
  PiImageSquareDuotone,
  PiKanbanDuotone,
  PiLayoutDuotone,
  PiMicrosoftExcelLogoDuotone,
  PiPackageDuotone,
  PiPictureInPictureDuotone,
  PiPresentationChartDuotone,
  PiTagChevronDuotone,
} from "react-icons/pi";

import { DocsSearchDialog } from "@/components/docs/DocsSearchDialog";
import { DocsSidebarThemeSwitch } from "@/components/docs/DocsSidebarThemeSwitch";
import { SectionSpacer } from "../../components/layout.client";
import { RootProvider } from "fumadocs-ui/provider/next";
import { SentryUserSync } from "@/components/common/SentryUserSync";

export default function DocsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccessEligibilityGuard>
      <SentryUserSync />
      <RootProvider search={{ SearchDialog: DocsSearchDialog }}>
        <DocsLayout
          containerProps={{
            className: "w-full [--fd-layout-width:100%]",
          }}
          slots={{
            themeSwitch: DocsSidebarThemeSwitch,
          }}
          tree={{
            name: "Uprevit Docs",
            type: "root",
            children: [
              {
                name: "Introduction",
                type: "page",
                url: "/docs",
                icon: <PiCompassDuotone />,
              },
              { type: "separator" },
              {
                name: "Getting Started",
                type: "folder",
                icon: <PiBookOpenDuotone />,
                defaultOpen: true,
                children: [
                  {
                    name: "Workspace",
                    type: "page",
                    url: "/docs/getting-started/workspace",
                    icon: <PiHouseDuotone />,
                  },
                  {
                    name: "Departments",
                    type: "page",
                    url: "/docs/getting-started/departments",
                    icon: <PiBuildingsDuotone />,
                  },
                  {
                    name: "Projects",
                    type: "page",
                    url: "/docs/getting-started/projects",
                    icon: <PiKanbanDuotone />,
                  },
                  {
                    name: "Products",
                    type: "page",
                    url: "/docs/getting-started/products",
                    icon: <PiPackageDuotone />,
                  },
                ],
              },
              { type: "separator" },
              {
                name: "Product Documentation",
                type: "folder",
                icon: <PiPackageDuotone />,
                defaultOpen: true,
                children: [
                  {
                    name: "Product Information",
                    type: "page",
                    url: "/docs/product-documentation/product-information",
                    icon: <PiLayoutDuotone />,
                  },
                  {
                    name: "Compliance Information",
                    type: "page",
                    url: "/docs/product-documentation/compliance-information",
                    icon: <PiBookOpenDuotone />,
                  },
                  {
                    name: "Label Components",
                    type: "page",
                    url: "/docs/product-documentation/label-components",
                    icon: <PiPictureInPictureDuotone />,
                  },
                  {
                    name: "Symbols & Graphics",
                    type: "page",
                    url: "/docs/product-documentation/symbols-graphics",
                    icon: <PiImageSquareDuotone />,
                  },
                  {
                    name: "Product Specifications",
                    type: "page",
                    url: "/docs/product-documentation/product-specifications",
                    icon: <PiMicrosoftExcelLogoDuotone />,
                  },
                  {
                    name: "Operational Parameters",
                    type: "page",
                    url: "/docs/product-documentation/operational-parameters",
                    icon: <PiDatabaseDuotone />,
                  },
                  {
                    name: "Label Tags",
                    type: "page",
                    url: "/docs/product-documentation/label-tags",
                    icon: <PiTagChevronDuotone />,
                  },
                ],
              },
              { type: "separator" },
              {
                name: "Source Files & Bookmarks",
                type: "folder",
                icon: <PiFolderOpenDuotone />,
                defaultOpen: true,
                children: [
                  {
                    name: "Source Files",
                    type: "page",
                    url: "/docs/source-files-bookmarks/source-files",
                    icon: <PiFolderOpenDuotone />,
                  },
                  {
                    name: "Bookmarks",
                    type: "page",
                    url: "/docs/source-files-bookmarks/bookmarks",
                    icon: <PiBookmarkSimpleDuotone />,
                  },
                ],
              },
              { type: "separator" },
              {
                name: "Review & Outputs",
                type: "folder",
                icon: <PiPresentationChartDuotone />,
                defaultOpen: true,
                children: [
                  {
                    name: "Redlines and Versions",
                    type: "page",
                    url: "/docs/review-outputs/redlines-versions",
                    icon: <PiGitBranchDuotone />,
                  },
                  {
                    name: "Reports",
                    type: "page",
                    url: "/docs/review-outputs/reports",
                    icon: <PiPresentationChartDuotone />,
                  },
                  {
                    name: "Exports",
                    type: "page",
                    url: "/docs/review-outputs/exports",
                    icon: <PiExportDuotone />,
                  },
                  {
                    name: "Archives",
                    type: "page",
                    url: "/docs/review-outputs/archives",
                    icon: <PiArchiveDuotone />,
                  },
                ],
              },
            ],
          }}
          sidebar={{
            components: {
              Separator: SectionSpacer,
            },
          }}
          {...baseOptions()}
          searchToggle={{ enabled: true }}
        >
          {children}
        </DocsLayout>
      </RootProvider>
    </AccessEligibilityGuard>
  );
}
