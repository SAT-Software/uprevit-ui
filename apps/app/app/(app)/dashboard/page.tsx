"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import DashboardProductsTable from "@/features/workspace/dashboard/DashboardProductsTable";
import DashboardDepartmentsCard from "@/features/workspace/dashboard/DashboardDepartmentsCard";
import DashboardProjectsCard from "@/features/workspace/dashboard/DashboardProjectsCard";
import { StatsGrid } from "@/features/workspace/dashboard/StatsGrid";
import Link from "next/link";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

function DashboardPage() {
  return (
    <div className="flex min-w-0 flex-col gap-8">
      <StatsGrid location="dashboard" />

      <div className="flex w-full min-w-0 flex-col gap-0 xl:flex-row">
        <DashboardDepartmentsCard />
        <DashboardProjectsCard />
      </div>

      <div className="flex flex-col items-start gap-2 justify-start w-full px-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start gap-0">
            <div className="flex gap-2 items-center">
              <p className="text-base font-semibold">Products</p>
              <InfoTooltip content="A product in Uprevit is a labeling documentation record: metadata, seven structured tabs, versions, and redlines" />
            </div>
            <p className="text-sm text-muted-foreground/80 font-normal">
              Latest products of your workspace
            </p>
          </div>
          <Link href="/products" className="shrink-0 group">
            <Button size="sm" variant="secondary">
              Show All
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={16}
                strokeWidth={2}
                className="text-foreground/40 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
              />
            </Button>
          </Link>
        </div>
        <div className="w-full">
          <DashboardProductsTable />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
