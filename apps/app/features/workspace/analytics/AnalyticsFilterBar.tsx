"use client";

import { useState } from "react";
import { AnalyticsFilterCombobox } from "@/features/workspace/analytics/AnalyticsFilterCombobox";
import { useGetDepartmentById } from "@/hooks/department/useGetDepartmentById";
import { useGetDepartmentsInfinite } from "@/hooks/department/useGetDepartmentsInfinite";
import { useGetProjectById } from "@/hooks/project/useGetProjectById";
import { useGetProjectsInfinite } from "@/hooks/project/useGetProjectsInfinite";
import type { AnalyticsFilters } from "@/types/analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";

const PERIODS = [
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "180", label: "Last 6 months" },
  { value: "365", label: "Last 12 months" },
];

const DAY_MS = 24 * 60 * 60 * 1000;
const toDay = (date: Date) => date.toISOString().slice(0, 10);

function periodOf(filters: AnalyticsFilters) {
  if (!filters.from) return "90";
  const to = filters.to ? new Date(filters.to) : new Date(toDay(new Date()));
  const days = (to.getTime() - new Date(filters.from).getTime()) / DAY_MS;
  return PERIODS.reduce((closest, period) =>
    Math.abs(Number(period.value) - days) <
    Math.abs(Number(closest.value) - days)
      ? period
      : closest,
  ).value;
}

export function AnalyticsFilterBar({
  filters,
  onChange,
}: {
  filters: AnalyticsFilters;
  onChange: (filters: AnalyticsFilters) => void;
}) {
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const departmentsQuery = useGetDepartmentsInfinite({
    limit: 50,
    search: departmentSearch,
  });
  const projectsQuery = useGetProjectsInfinite({
    limit: 50,
    search: projectSearch,
    departmentId: filters.departmentId,
  });
  const { data: selectedDepartment } = useGetDepartmentById(
    filters.departmentId ?? "",
  );
  const { data: selectedProject } = useGetProjectById(filters.projectId ?? "");
  const departments = (departmentsQuery.data?.pages ?? []).flatMap(
    (page) =>
      (page.result?.departments ?? []).map(
        (department: { _id: string; department_name: string }) => ({
          value: department._id,
          label: department.department_name,
        }),
      ),
  );
  const projects = (projectsQuery.data?.pages ?? []).flatMap((page) =>
    (page.result?.projects ?? []).map(
      (project: { _id: string; project_name: string }) => ({
        value: project._id,
        label: project.project_name,
      }),
    ),
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={periodOf(filters)}
        onValueChange={(days) =>
          onChange({
            ...filters,
            from:
              days === "90"
                ? undefined
                : toDay(new Date(Date.now() - Number(days) * DAY_MS)),
            to: undefined,
          })
        }
      >
        <SelectTrigger className="h-8 w-auto" aria-label="Period">
          <SelectValue placeholder="Last 90 days" />
        </SelectTrigger>
        <SelectContent>
          {PERIODS.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <AnalyticsFilterCombobox
        label="Department"
        allLabel="All departments"
        value={filters.departmentId}
        selectedLabel={selectedDepartment?.department?.department_name}
        options={departments}
        isPending={departmentsQuery.isPending}
        isError={departmentsQuery.isError}
        hasNextPage={departmentsQuery.hasNextPage}
        isFetching={departmentsQuery.isFetching}
        isFetchingNextPage={departmentsQuery.isFetchingNextPage}
        fetchNextPage={departmentsQuery.fetchNextPage}
        onSearchChange={setDepartmentSearch}
        onChange={(departmentId) =>
          onChange({ ...filters, departmentId, projectId: undefined })
        }
      />

      <AnalyticsFilterCombobox
        label="Project"
        allLabel="All projects"
        value={filters.projectId}
        selectedLabel={selectedProject?.project?.project_name}
        options={projects}
        isPending={projectsQuery.isPending}
        isError={projectsQuery.isError}
        hasNextPage={projectsQuery.hasNextPage}
        isFetching={projectsQuery.isFetching}
        isFetchingNextPage={projectsQuery.isFetchingNextPage}
        fetchNextPage={projectsQuery.fetchNextPage}
        onSearchChange={setProjectSearch}
        onChange={(projectId) => onChange({ ...filters, projectId })}
      />
    </div>
  );
}
