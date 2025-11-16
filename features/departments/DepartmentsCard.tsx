import { Button } from "@/components/ui/button";
import { CalendarClock, Text } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PiPlusBold, PiCirclesThreePlusDuotone } from "react-icons/pi";
import { MembersInlineTrigger } from "@/components/common/MembersDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PiArrowSquareOutDuotone } from "react-icons/pi";
import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";

interface DepartmentUser {
  _id: string;
  name: string;
  email: string;
  profileAvatar?: string;
}

export interface DepartmentsProps {
  _id: string;
  image?: string;
  department_name: string;
  department_description: string;
  date?: string;
  manager?: string;
  users?: DepartmentUser[];
  members?: { name: string; src: string }[];
  membersCount?: number;
}

function DepartmentsCard() {
  const { data, isLoading, error } = useGetAllDepartments();
  const departments = data?.result?.departments ?? [];

  console.log("All departments:", departments);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">
          Failed to load departments. Please try again.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-start w-full gap-2 h-full">
      {departments?.map((department: DepartmentsProps) => (
        <div
          key={department._id}
          className="relative flex flex-col md:flex-row items-center w-full border border-input rounded-xl p-2 justify-between gap-4"
        >
          <div className="absolute right-2 top-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/departments/${department._id}`}
                  aria-label="Open department details"
                >
                  <Button variant="ghost" size="icon">
                    <PiArrowSquareOutDuotone className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Open department details</TooltipContent>
            </Tooltip>
          </div>
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
              <p className="text-base font-semibold">
                {department.department_name}
              </p>
              <p className="flex items-start gap-1 text-xs text-muted-foreground">
                <span>
                  <Text className="mr-1 w-4 h-4" />
                </span>
                {department.department_description}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between w-full gap-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>
                  <CalendarClock className="mr-1 w-4 h-4" />
                </span>
                <p className="text-xs text-muted-foreground">
                  {department.date
                    ? new Date(department.date).toLocaleDateString()
                    : "No date"}
                </p>
              </div>
              <div className="flex items-center -space-x-[0.525rem] mr-3">
                {(() => {
                  const usersData = department?.users;

                  const users = usersData?.map((user) => ({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    profileAvatar: user.profileAvatar,
                  }));
                  return (
                    <MembersInlineTrigger
                      users={users || []}
                      titlePrefix={department.department_name}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
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
export default DepartmentsCard;
