import { DepartmentsProps } from "@/features/departments/DepartmentsCard";

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