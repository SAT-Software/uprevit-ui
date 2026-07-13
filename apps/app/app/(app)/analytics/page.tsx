"use client";

import { useMemo } from "react";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { AnalyticsStatsGrid } from "@/features/workspace/analytics/AnalyticsStatsGrid";
import { ProductsByDepartmentChart } from "@/features/workspace/analytics/ProductsByDepartmentBarChart";
import { ProductsByProjectChart } from "@/features/workspace/analytics/ProductsByProjectBarChart";
import { ProductsOverTimeChart } from "@/features/workspace/analytics/ProductsVsTimeLineChart";
import { useGetArchivedProducts } from "@/hooks/archive/useGetArchivedProducts";
import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { useGetAllProjects } from "@/hooks/project/useGetAllProjects";
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Analytics</p>
          <InfoTooltip content="Visualize your workspace data with interactive charts across products, departments, and projects." />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <AnalyticsStatsGrid kpi={analytics.kpi} isLoading={isLoading} />

        <div className="flex flex-col gap-2 p-2">
          <ProductsOverTimeChart
            data={analytics.timeData}
            departments={analytics.departments}
            projects={analytics.projects}
            isLoading={isLoading}
          />

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
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
    </div>
  );
}
