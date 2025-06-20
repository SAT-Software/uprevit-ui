import Projects, { ProjectsProps } from "@/features/projects/ProjectsCard";
import CreateProjectDialog from "@/features/projects/CreateProjectDialog";

export const projects: (ProjectsProps & { departmentId: string })[] = [
  {
    id: "PROJ-ALPHA",
    name: "Project One",
    description: "A SaaS dashboard for HR analytics and team management.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80", // dashboard
    date: 1715330400000, // May 10, 2025 - 09:30 AM
    targetDate: 1719792000000, // June 30, 2025
    completionDate: 1721088000000, // July 15, 2025
    delayReason:
      "Additional security requirements and third-party integration complexities",
    members: [
      { name: "Amit Shah", src: "/avatar-80-03.jpg" },
      { name: "Priya Verma", src: "/avatar-80-04.jpg" },
      { name: "Ravi Kumar", src: "/avatar-80-05.jpg" },
    ],
    manager: "Amit Shah",
    membersCount: 12,
    departmentId: "uih2gf872y", // Department One
  },
  {
    id: "PROJ-BETA",
    name: "Project Two",
    description: "Mobile app for internal communication and announcements.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80", // mobile app
    date: 1715763600000, // May 15, 2025 - 02:00 PM
    targetDate: 1724112000000, // August 20, 2025
    completionDate: null,
    delayReason: null,
    members: [
      { name: "Sonal Mehta", src: "/avatar-80-06.jpg" },
      { name: "Amit Shah", src: "/avatar-80-03.jpg" },
    ],
    manager: "Sonal Mehta",
    membersCount: 8,
    departmentId: "uh2t38787gce8", // Department Two
  },
  {
    id: "PROJ-GAMMA",
    name: "Project Three",
    description: "Automated payroll processing system for finance department.",
    image: "",
    // "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80", // finance/payroll
    date: 1717234500000, // June 1, 2025 - 11:15 AM
    targetDate: 1726444800000, // September 15, 2025
    completionDate: 1726012800000, // September 10, 2025
    delayReason: null,
    members: [
      { name: "Ravi Kumar", src: "/avatar-80-05.jpg" },
      { name: "Adam Tosa", src: "/avatar-80-07.jpg" },
    ],
    manager: "Ravi Kumar",
    membersCount: 5,
    departmentId: "uih2gf872y", // Department One
  },
  {
    id: "PROJ-DELTA",
    name: "Project Four",
    description: "Employee onboarding and document management tool.",
    image: "",
    // "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80", // onboarding
    date: 1718033100000, // June 10, 2025 - 04:45 PM
    targetDate: 1728086400000, // October 5, 2025
    completionDate: null,
    delayReason: null,
    members: [
      { name: "Priya Verma", src: "/avatar-80-04.jpg" },
      { name: "Sonal Mehta", src: "/avatar-80-06.jpg" },
    ],
    manager: "Priya Verma",
    membersCount: 7,
    departmentId: "uh2t38787gce8", // Department Two
  },
  {
    id: "PROJ-EPSILON",
    name: "Project Five",
    description: "Company-wide feedback and survey platform.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80", // mobile app
    date: 1718895600000, // June 20, 2025 - 10:00 AM
    targetDate: 1730422800000, // November 1, 2025
    completionDate: 1732060800000, // November 20, 2025
    delayReason:
      "Scope expansion to include advanced analytics and reporting features",
    members: [
      { name: "Amit Shah", src: "/avatar-80-03.jpg" },
      { name: "Adam Tosa", src: "/avatar-80-07.jpg" },
      { name: "Priya Verma", src: "/avatar-80-04.jpg" },
    ],
    manager: "Amit Shah",
    membersCount: 10,
    departmentId: "uih2gf872y", // Department One
  },
];

function ProjectsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <p className="text-base font-semibold">All Projects</p>
          <CreateProjectDialog />
        </div>
        <Projects projects={projects} />
      </div>
    </div>
  );
}

export default ProjectsPage;
