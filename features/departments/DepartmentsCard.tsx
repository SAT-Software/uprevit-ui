import { Button } from "@/components/ui/button";
import { CalendarClock, Text } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PiPlusBold, PiCirclesThreePlusDuotone } from "react-icons/pi";

export interface DepartmentsProps {
  id: string;
  image?: string;
  name: string;
  description: string;
  date: string;
  manager: string;
  members: { name: string; src: string }[];
  membersCount: number;
}

function Departments({ departments }: { departments: DepartmentsProps[] }) {
  return (
    <div className="flex flex-col items-start w-full gap-2 h-full">
      {departments?.map((department) => (
        <Link
          key={department.id}
          href={`/departments/${department.id}`}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row items-center w-full border border-input rounded-xl p-2 justify-between gap-4">
            <div className="flex items-center relative w-full h-27 md:w-40">
              {department.image ? (
                <Image
                  src={department.image}
                  fill
                  alt="Department"
                  className="object-cover rounded-md border border-input"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-muted rounded-md border border-input">
                  <PiCirclesThreePlusDuotone className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex flex-col items-start justify-between w-full gap-4">
              <div className="flex flex-col items-start gap-1">
                <p className="text-base font-semibold">{department.name}</p>
                <p className="flex items-start gap-1 text-xs text-muted-foreground">
                  <span>
                    <Text className="mr-1 w-4 h-4" />
                  </span>
                  {department.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between w-full gap-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>
                    <CalendarClock className="mr-1 w-4 h-4" />
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {department.date}
                  </p>
                </div>
                <div className="flex items-center -space-x-[0.525rem]">
                  {department.members.map((member) => (
                    <Image
                      key={member.name}
                      className="ring-background rounded-full ring-2"
                      src={member.src}
                      width={28}
                      height={28}
                      alt={member.name}
                    />
                  ))}
                  <p className="text-xs text-muted-foreground ml-4">
                    {department.membersCount} Members
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
      {departments?.length === 0 && (
        <div className="flex flex-col gap-4 items-center justify-center w-full h-100">
          <p className="text-base md:text-xl font-semibold text-foreground">
            There are no departments to display. Create your first department
          </p>
          <Button variant="default" className="flex items-center gap-2">
            Create new Department <PiPlusBold />
          </Button>
        </div>
      )}
    </div>
  );
}
export default Departments;
