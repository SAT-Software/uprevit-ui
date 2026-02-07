"use client";

import * as React from "react";
import { useMemo } from "react";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { useGetArchivedProducts } from "@/hooks/archive/useGetArchivedProducts";
import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";
import { useGetAllProjects } from "@/hooks/project/useGetAllProjects";
import {
  PiPackageDuotone,
  PiPencilSimpleLineDuotone,
  PiCheckCircleDuotone,
  PiArchiveDuotone,
  PiWarningDuotone,
} from "react-icons/pi";
import { ProductsByDepartmentChart } from "@/features/workspace/analytics/ProductsByDepartmentBarChart";
import { ProductsByProjectChart } from "@/features/workspace/analytics/ProductsByProjectBarChart";
import { ProductsOverTimeChart } from "@/features/workspace/analytics/ProductsVsTimeLineChart";
import type { Department } from "@/types/department";
import type { Project } from "@/types/project";

type ProductAnalyticsItem = {
  _id?: string;
  status?: "draft" | "submitted" | "archived";
  target_date?: string | null;
  department_id?: string;
  project_id?: string;
  auditLogs?: Array<{ actionAt?: string | Date }>;
  createdAt?: string;
  department?: Array<{ department_name?: string }>;
  project?: Array<{ project_name?: string }>;
};

export default function AnalyticsPage() {
  const { data: productsData, isLoading: productsLoading } =
    useGetAllProducts();
  const { data: archivedProductsData, isLoading: archivedLoading } =
    useGetArchivedProducts();
  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetAllDepartments();
  const { data: projectsData, isLoading: projectsLoading } =
    useGetAllProjects();

  const isLoading =
    productsLoading || archivedLoading || departmentsLoading || projectsLoading;

  const analytics = useMemo(() => {
    const products =
      (productsData?.result?.products as ProductAnalyticsItem[]) || [];
    const archivedProducts =
      (archivedProductsData?.result?.products as ProductAnalyticsItem[]) || [];
    const departments = (departmentsData?.data as Department[]) || [];
    const projects = (projectsData?.data as Project[]) || [];

    const totalProducts = products.length;
    const draftCount = products.filter((p) => p.status === "draft").length;
    const submittedCount = products.filter((p) => p.status === "submitted")
      .length;
    const archivedCount = archivedProducts.length;

    const today = new Date();
    const overdueCount = products.filter((p) => {
      if (p.status === "archived" || p.status === "submitted") return false;
      if (!p.target_date) return false;
      return new Date(p.target_date) < today;
    }).length;

    const statusData = [
      { status: "draft", count: draftCount, fill: "var(--color-draft)" },
      {
        status: "submitted",
        count: submittedCount,
        fill: "var(--color-submitted)",
      },
      {
        status: "archived",
        count: archivedCount,
        fill: "var(--color-archived)",
      },
    ].filter((item) => item.count > 0);

    const departmentCounts: Record<string, { name: string; count: number }> =
      {};
    products.forEach((p) => {
      const deptId = p.department_id ?? "unknown";
      const deptName = p.department?.[0]?.department_name || "Unknown";
      if (!departmentCounts[deptId]) {
        departmentCounts[deptId] = { name: deptName, count: 0 };
      }
      departmentCounts[deptId].count++;
    });
    const departmentData = Object.entries(departmentCounts)
      .map(([, data]) => ({ department: data.name, products: data.count }))
      .sort((a, b) => b.products - a.products);

    const projectCounts: Record<string, { name: string; count: number }> = {};
    products.forEach((p) => {
      const projId = p.project_id ?? "unknown";
      const projName = p.project?.[0]?.project_name || "Unknown";
      if (!projectCounts[projId]) {
        projectCounts[projId] = { name: projName, count: 0 };
      }
      projectCounts[projId].count++;
    });
    const projectData = Object.entries(projectCounts)
      .map(([, data]) => ({ project: data.name, products: data.count }))
      .sort((a, b) => b.products - a.products);

    const dailyData: Record<string, number> = {};
    products.forEach((p) => {
      const createdAt = p.auditLogs?.[0]?.actionAt || p.createdAt;
      if (createdAt) {
        const date = new Date(createdAt);
        const dateKey = date.toISOString().split("T")[0];
        dailyData[dateKey] = (dailyData[dateKey] || 0) + 1;
      }
    });
    const timeData = Object.entries(dailyData)
      .map(([date, count]) => ({ date, products: count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      kpi: {
        totalProducts,
        draftCount,
        submittedCount,
        archivedCount,
        overdueCount,
      },
      statusData,
      departmentData,
      projectData,
      timeData,
      departments,
      projects,
    };
  }, [productsData, archivedProductsData, departmentsData, projectsData]);

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col items-start gap-2 justify-start border border-border bg-background rounded-xl p-2 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <div className="flex items-center gap-2 p-2">
            <h1 className="text-base font-semibold">Analytics</h1>
            <div className="w-1 h-1 bg-border border border-border rounded-full hidden sm:block" />
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              Visualize your workspace data with interactive charts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 w-full">
          <KPICard
            title="Total Products"
            value={analytics.kpi.totalProducts}
            icon={PiPackageDuotone}
            isLoading={isLoading}
          />
          <KPICard
            title="Draft"
            value={analytics.kpi.draftCount}
            icon={PiPencilSimpleLineDuotone}
            isLoading={isLoading}
          />
          <KPICard
            title="Submitted"
            value={analytics.kpi.submittedCount}
            icon={PiCheckCircleDuotone}
            isLoading={isLoading}
          />
          <KPICard
            title="Archived"
            value={analytics.kpi.archivedCount}
            icon={PiArchiveDuotone}
            isLoading={isLoading}
          />
          <KPICard
            title="Overdue"
            value={analytics.kpi.overdueCount}
            icon={PiWarningDuotone}
            isLoading={isLoading}
          />
        </div>

        <div className="w-full">
          <ProductsOverTimeChart
            data={analytics.timeData}
            departments={analytics.departments}
            projects={analytics.projects}
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 w-full">
          <ProductsByDepartmentChart
            data={analytics.departmentData}
            isLoading={isLoading}
          />

          <ProductsByProjectChart
            data={analytics.projectData}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  isLoading?: boolean;
}

function KPICard({ title, value, icon: Icon, isLoading }: KPICardProps) {
  return (
    <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-card">
      <div className="flex items-center  justify-center size-10 rounded-full bg-muted">
        <Icon className={`size-5 text-muted-foreground`} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground font-medium uppercase">
          {title}
        </span>
        {isLoading ? (
          <div className="h-7 w-12 bg-muted rounded animate-pulse" />
        ) : (
          <span className="text-2xl font-semibold">
            {value <= 9 ? `0${value}` : value}
          </span>
        )}
      </div>
    </div>
  );
}
