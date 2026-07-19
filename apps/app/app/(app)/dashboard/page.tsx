"use client";

import DashboardProductsTable from "@/features/workspace/dashboard/DashboardProductsTable";
import DashboardDepartmentsCard from "@/features/workspace/dashboard/DashboardDepartmentsCard";
import DashboardProjectsCard from "@/features/workspace/dashboard/DashboardProjectsCard";
import { StatsGrid } from "@/features/workspace/dashboard/StatsGrid";

function DashboardPage() {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <StatsGrid location="dashboard" />

      <div className="flex w-full min-w-0 flex-col gap-2 px-2 xl:flex-row">
        <DashboardDepartmentsCard />
        <DashboardProjectsCard />
      </div>

      <div className="w-full min-w-0 px-2">
        <DashboardProductsTable />
      </div>
    </div>
  );
}

export default DashboardPage;
