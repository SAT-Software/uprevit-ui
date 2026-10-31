"use client";

import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";
import { useGetAllProjects } from "@/hooks/project/useGetAllProjects";
import type { AnalyticsFilters } from "@/types/analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";

const ALL = "all";
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
  const { data: departmentsData } = useGetAllDepartments({ limit: 100 });
  const { data: projectsData } = useGetAllProjects({ limit: 100 });
  const departments: { _id: string; department_name: string }[] =
    departmentsData?.result?.departments ?? [];
  const projects: { _id: string; project_name: string; department_id?: string }[] =
    (projectsData?.result?.projects ?? []).filter(
      (project: { department_id?: string }) =>
        !filters.departmentId || project.department_id === filters.departmentId,
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

      <Select
        value={filters.departmentId ?? ALL}
        onValueChange={(departmentId) =>
          onChange({
            ...filters,
            departmentId: departmentId === ALL ? undefined : departmentId,
            projectId: undefined,
          })
        }
      >
        <SelectTrigger className="h-8 w-auto max-w-56" aria-label="Department">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All departments</SelectItem>
          {departments.map((department) => (
            <SelectItem key={department._id} value={department._id}>
              {department.department_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.projectId ?? ALL}
        onValueChange={(projectId) =>
          onChange({
            ...filters,
            projectId: projectId === ALL ? undefined : projectId,
          })
        }
      >
        <SelectTrigger className="h-8 w-auto max-w-56" aria-label="Project">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project._id} value={project._id}>
              {project.project_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
