import { cn } from "@uprevit/ui/lib/utils";
import { Icon } from "../common/Icon";
import { Loading03Icon } from "@hugeicons/core-free-icons";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Icon
      icon={Loading03Icon}
      className={cn("size-4 animate-spin", className)}
    />
  );
}

export { Spinner };
