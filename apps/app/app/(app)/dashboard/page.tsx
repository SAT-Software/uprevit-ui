"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import DashboardProductsTable from "@/features/workspace/dashboard/DashboardProductsTable";
import DashboardDepartmentsCard from "@/features/workspace/dashboard/DashboardDepartmentsCard";
import DashboardProjectsCard from "@/features/workspace/dashboard/DashboardProjectsCard";
import { StatsGrid } from "@/features/workspace/dashboard/StatsGrid";
import Link from "next/link";
import { PiArrowCircleUpRightDuotone } from "react-icons/pi";

function DashboardPage() {
  return (
    <div className="flex flex-col gap-2 p-2">
      <StatsGrid location="dashboard" />

      <div className="flex flex-col xl:flex-row w-full justify-between gap-2">
        <DashboardDepartmentsCard />
        <DashboardProjectsCard />
      </div>

      <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full ">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold">Products</p>
            <div className="w-1 h-1 bg-border border border-border rounded-full" />
            <p className="text-xs text-muted-foreground font-medium">
              Latest products of your workspace
            </p>
          </div>
          <Link href="/products">
            <Button size="sm" variant="secondary">
              <PiArrowCircleUpRightDuotone />
              Show All
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
