"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PiMoonDuotone, PiSunDuotone } from "react-icons/pi";
import { cn } from "@/lib/utils";

export function ThemeToggle({ background }: { background: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          background === "dark" &&
            "bg-foreground text-background dark:text-foreground border-muted-foreground hover:bg-neutral-950 hover:text-neutral-100"
        )}
        asChild
      >
        <Button variant="outline" className="size-8" size="icon">
          {mounted && resolvedTheme === "dark" ? (
            <PiMoonDuotone className="h-3 w-3" />
          ) : (
            <PiSunDuotone className="h-3 w-3" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(
          background === "dark" &&
            "bg-foreground dark:bg-background text-background dark:text-foreground border-neutral-700 hover:bg-neutral-950 hover:text-neutral-100"
        )}
        align="end"
      >
        <DropdownMenuItem
          className={cn(
            background === "dark" &&
              "hover:bg-neutral-700 hover:text-neutral-100"
          )}
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
