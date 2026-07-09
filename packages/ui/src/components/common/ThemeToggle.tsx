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

export function ThemeToggle({ background }: { background?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          background === "dark" &&
            "bg-foreground text-background dark:text-foreground border-muted-foreground hover:bg-neutral-950 hover:text-neutral-100",
        )}
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
        className={cn(
          background === "dark" &&
            "bg-foreground dark:bg-background text-background dark:text-foreground border-neutral-700 hover:bg-neutral-950 hover:text-neutral-100",
        )}
        align="end"
      >
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem
            className={cn(
              background === "dark" &&
                "hover:bg-neutral-700 hover:text-neutral-100",
            )}
            value="light"
          >
            <Icon icon={Sun01Icon} size={16} strokeWidth={2} />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className={cn(
              background === "dark" &&
                "hover:bg-neutral-700 hover:text-neutral-100",
            )}
            value="dark"
          >
            <Icon icon={Moon02Icon} size={16} strokeWidth={2} />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            className={cn(
              background === "dark" &&
                "hover:bg-neutral-700 hover:text-neutral-100",
            )}
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
