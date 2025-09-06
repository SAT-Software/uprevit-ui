"use client";

import { Button } from "@/components/ui/button";
import DashboardProductsTable from "@/features/dashboard/DashboardProductsTable";
import DashboardDepartmentsCard from "@/features/dashboard/DashboardDepartmentsCard";
import DashboardProjectsCard from "@/features/dashboard/DashboardProjectsCard";
import { StatsCardProps, StatsGrid } from "@/features/dashboard/StatsGrid";
import Link from "next/link";
import {
  PiCirclesThreePlusDuotone,
  PiKanbanDuotone,
  PiStackPlusDuotone,
  PiFolderOpenDuotone,
} from "react-icons/pi";
import { sampleProducts } from "../products/data";

const stats: StatsCardProps[] = [
  {
    title: "Departments",
    value: "04",
    change: {
      value: "+12%",
      trend: "up",
    },
    icon: PiCirclesThreePlusDuotone,
    location: "dashboard",
  },
  {
    title: "Projects",
    value: "22",
    change: {
      value: "+42%",
      trend: "up",
    },
    icon: PiKanbanDuotone,
    location: "dashboard",
  },
  {
    title: "Products",
    value: "82",
    change: {
      value: "+37%",
      trend: "up",
    },
    icon: PiStackPlusDuotone,
    location: "dashboard",
  },
  {
    title: "Source Files",
    value: "3,497",
    change: {
      value: "-17%",
      trend: "down",
    },
    icon: PiFolderOpenDuotone,
    location: "dashboard",
  },
];

const recentProductsData = sampleProducts.slice(0, 3);

function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Summary stats cards */}
      <StatsGrid stats={stats} location="dashboard" />

      {/* Departments and Projects */}
      <div className="flex flex-col xl:flex-row w-full justify-between gap-4">
        <DashboardDepartmentsCard />
        <DashboardProjectsCard />
      </div>

      {/* Products */}
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full ">
        <div className="flex items-center justify-between w-full">
          <p className="text-base font-semibold">Recent Products</p>
          <Link href="/products">
            <Button variant="outline">All Products</Button>
          </Link>
        </div>
        <div className="w-full">
          <DashboardProductsTable data={recentProductsData} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
