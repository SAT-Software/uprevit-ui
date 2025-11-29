"use client";

import { Button } from "@/components/ui/button";
import DashboardProductsTable from "@/features/workspace/dashboard/DashboardProductsTable";
import DashboardDepartmentsCard from "@/features/workspace/dashboard/DashboardDepartmentsCard";
import DashboardProjectsCard from "@/features/workspace/dashboard/DashboardProjectsCard";
import { StatsGrid } from "@/features/workspace/dashboard/StatsGrid";
import Link from "next/link";

function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <StatsGrid location="dashboard" />

      <div className="flex flex-col xl:flex-row w-full justify-between gap-4">
        <DashboardDepartmentsCard />
        <DashboardProjectsCard />
      </div>

      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full ">
        <div className="flex items-center justify-between w-full">
          <p className="text-base font-semibold">Recent Products</p>
          <Link href="/products">
            <Button variant="outline">All Products</Button>
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
