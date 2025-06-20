import { Button } from "@/components/ui/button";
import DashboardProductsTable from "@/features/dashboard/DashboardProductsTable";
import Departments from "@/features/dashboard/DepartmentsCard";
import ProjectsCard from "@/features/dashboard/ProjectsCard";
import { StatsCardProps, StatsGrid } from "@/features/dashboard/StatsGrid";
import Link from "next/link";
import {
  PiCirclesThreePlus,
  PiFolderOpen,
  PiKanban,
  PiStackPlus,
} from "react-icons/pi";
import { projects as allProjectsData } from "@/app/(app)/projects/page";
import { departments } from "../departments/page";
import { sampleProducts } from "../products/page";

const departmentsLookup: { [key: string]: string } = {
  uih2gf872y: "Department One",
  uh2t38787gce8: "Department Two",
};

const parseDate = (dateString: number): Date => {
  try {
    const parsed = new Date(dateString);
    if (isNaN(parsed.getTime())) {
      console.warn("Could not parse date:", dateString);
      return new Date(0);
    }
    return parsed;
  } catch (e) {
    console.error("Error parsing date:", dateString, e);
    return new Date(0);
  }
};

const sortedProjects = [...allProjectsData].sort(
  (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
);

const recentProjectsData = sortedProjects.slice(0, 3);

// Define DashboardProject type expected by RecentProjects component (Renamed from Project)
type DashboardProject = {
  id: string;
  image: string;
  projectNumber: string; // Using project ID
  projectName: string;
  department: string;
};

// Map the recent projects to the required structure
export const projects: DashboardProject[] = recentProjectsData.map((p) => ({
  id: p.id,
  image: p.image,
  projectNumber: p.id, // Use project ID as project number for now
  projectName: p.name,
  department: departmentsLookup[p.departmentId] || "Unknown Dept",
}));

const stats: StatsCardProps[] = [
  {
    title: "Departments",
    value: "04",
    change: {
      value: "+12%",
      trend: "up",
    },
    icon: PiCirclesThreePlus,
    location: "dashboard",
  },
  {
    title: "Projects",
    value: "22",
    change: {
      value: "+42%",
      trend: "up",
    },
    icon: PiKanban,
    location: "dashboard",
  },
  {
    title: "Products",
    value: "82",
    change: {
      value: "+37%",
      trend: "up",
    },
    icon: PiStackPlus,
    location: "dashboard",
  },
  {
    title: "Source Files",
    value: "3,497",
    change: {
      value: "-17%",
      trend: "down",
    },
    icon: PiFolderOpen,
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
        <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full">
          <div className="flex items-center w-full justify-between">
            <p className="text-base font-semibold">Recent Departments</p>
            <Link href="/departments">
              <Button variant="outline">All Departments</Button>
            </Link>
          </div>
          <Departments departments={departments} />
        </div>
        <ProjectsCard projects={projects} />
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
