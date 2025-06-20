import CreateDepartmentDialog from "@/features/departments/CreateDepartmentDialog";
import Departments, {
  DepartmentsProps,
} from "@/features/departments/DepartmentsCard";

export const departments: DepartmentsProps[] = [
  {
    id: "uih2gf872y",
    name: "Department One",
    description:
      "This is just a placeholder for the department description that the admin will add",
    image: "/department.jpg",
    date: "June 5, 2029 - 12:00 PM",
    members: [
      { name: "Avatar 01", src: "/avatar-80-03.jpg" },
      { name: "Avatar 02", src: "/avatar-80-04.jpg" },
      { name: "Avatar 03", src: "/avatar-80-05.jpg" },
      { name: "Avatar 04", src: "/avatar-80-06.jpg" },
    ],
    membersCount: 28,
    manager: "Alice Wonderland",
  },
  {
    id: "uh2t38787gce8",
    name: "Department Two",
    description:
      "This is just a placeholder for the department description that the admin will add",
    date: "June 5, 2029 - 12:00 PM",
    members: [
      { name: "Avatar 03", src: "/avatar-80-05.jpg" },
      { name: "Avatar 02", src: "/avatar-80-04.jpg" },
      { name: "Avatar 01", src: "/avatar-80-03.jpg" },
      { name: "Avatar 04", src: "/avatar-80-06.jpg" },
    ],
    membersCount: 28,
    manager: "Bob Builder",
  },
];

function DepartmentsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <p className="text-base font-semibold">All Departments</p>

          <CreateDepartmentDialog />
        </div>
        <Departments departments={departments} />
      </div>
    </div>
  );
}

export default DepartmentsPage;
