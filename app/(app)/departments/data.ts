import { DepartmentsProps } from "@/features/departments/DepartmentsCard";

export const departments: DepartmentsProps[] = [
  {
    id: "uih2gf872y",
    department_name: "Department One",
    department_description:
      "This is just a placeholder for the department description that the admin will add",
    image: "/department.jpg",
    date: new Date().toLocaleDateString(),
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
    department_name: "Department Two",
    department_description:
      "This is just a placeholder for the department description that the admin will add",
    date: new Date().toLocaleDateString(),
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
