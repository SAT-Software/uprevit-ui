"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@uprevit/ui/lib/utils";

const links = [
  { href: "/platform-admin", label: "Dashboard", exact: true },
  { href: "/platform-admin/workspaces", label: "Workspaces" },
  { href: "/platform-admin/audit-logs", label: "Audit logs" },
];

export function PlatformAdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
