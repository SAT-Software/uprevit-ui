import Link from "next/link";

export function AnalyticsDrillLinks({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  if (!links.length) return null;

  return (
    <nav
      aria-label={label}
      className="sr-only focus-within:not-sr-only focus-within:flex focus-within:flex-wrap focus-within:gap-1 focus-within:px-3 focus-within:pb-3"
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-md border border-border px-2 py-0.5 text-xs tabular-nums transition-colors duration-150 ease-out hover:bg-muted"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
