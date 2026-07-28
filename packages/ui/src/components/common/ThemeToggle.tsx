"use client";

import { useTheme } from "next-themes";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@uprevit/ui/components/ui/dropdown-menu";
import {
  ComputerIcon,
  Moon02Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";

const darkSurfaceTrigger =
  "bg-neutral-900 text-neutral-100 border-neutral-700 hover:bg-neutral-800 hover:text-neutral-50 [&_svg]:!text-neutral-100";

const darkSurfaceContent =
  "bg-neutral-950 text-neutral-100 border-neutral-700";

const darkSurfaceItem =
  "text-neutral-100 focus:bg-neutral-800 focus:text-neutral-50 hover:bg-neutral-800 hover:text-neutral-50 [&_svg]:!text-neutral-400 focus:[&_svg]:!text-neutral-100 hover:[&_svg]:!text-neutral-100";

export function ThemeToggle({ background }: { background?: string }) {
  const { theme, setTheme } = useTheme();
  const onDarkSurface = background === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(onDarkSurface && darkSurfaceTrigger)}
        asChild
      >
        <Button variant="outline" size="icon-xs">
          <Icon
            icon={Sun01Icon}
            size={14}
            strokeWidth={2}
            className="dark:hidden"
          />
          <Icon
            icon={Moon02Icon}
            size={14}
            strokeWidth={2}
            className="hidden dark:block"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(onDarkSurface && darkSurfaceContent)}
        align="end"
      >
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem
            className={cn(onDarkSurface && darkSurfaceItem)}
            value="light"
          >
            <Icon icon={Sun01Icon} size={16} strokeWidth={2} />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className={cn(onDarkSurface && darkSurfaceItem)}
            value="dark"
          >
            <Icon icon={Moon02Icon} size={16} strokeWidth={2} />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className={cn(onDarkSurface && darkSurfaceItem)}
            value="system"
          >
            <Icon icon={ComputerIcon} size={16} strokeWidth={2} />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
