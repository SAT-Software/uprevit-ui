import Link from "next/link";
import {
  ArrowRight02Icon,
  BookOpen02Icon,
  File02Icon,
  News01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { TileRow, TileSpacerRow } from "@/components/TileGrid";

const RESOURCES = [
  {
    id: "blogs",
    title: "Blog",
    description:
      "Regulatory updates, how-to guides and product news for teams that write, review and release medical device labels.",
    icon: News01Icon,
    href: "/resources/blogs",
    meta: "Regulatory updates and field notes",
    highlights: ["Product guides", "FDA + EU MDR updates", "Release notes"],
    cta: "Read articles",
    available: true,
  },
  {
    id: "standards-symbols",
    title: "Standards & Symbols",
    description:
      "Centralized ISO references and standardized medical device symbols for global regulatory alignment.",
    icon: BookOpen02Icon,
    href: "/resources/standards-symbols",
    meta: "ISO library and symbol usage guidance",
    highlights: ["ISO 15223-1", "Device symbol library", "Usage references"],
    cta: "View preview",
    available: false,
  },
  {
    id: "templates",
    title: "Templates",
    description:
      "Checklists and structured templates built by regulatory experts to keep labeling documentation audit-ready.",
    icon: File02Icon,
    href: "/resources/templates",
    meta: "Checklists, validation kits and naming guides",
    highlights: ["Gap assessments", "Validation templates", "Project timelines"],
    cta: "View preview",
    available: false,
  },
  {
    id: "toolkits",
    title: "Toolkits",
    description:
      "Free compliance tools to streamline labeling workflows, validation and symbol management.",
    icon: Wrench01Icon,
    href: "/resources/toolkits",
    meta: "Free tools, rolling releases",
    highlights: ["Label generator", "Compliance checker", "Symbol manager"],
    cta: "View preview",
    available: false,
  },
];

export default function ResourcesHub() {
  return (
    <>
      <TileRow
        as="section"
        aria-labelledby="resources-hero-heading"
        centerClassName="relative overflow-hidden px-5 pt-12 pb-9 sm:px-10 sm:pt-16 sm:pb-12 lg:px-12 lg:pt-[88px] lg:pb-16"
      >
        <div
          aria-hidden="true"
          className="tile-dots pointer-events-none absolute bottom-0 right-0 h-[280px] w-full overflow-hidden sm:h-[360px] lg:h-[420px]"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 90% 85% at 100% 100%, transparent 0%, color-mix(in srgb, var(--tile-surface-solid) 70%, transparent) 55%, var(--tile-surface-solid) 100%)",
            }}
          />
        </div>

        <div className="relative flex flex-col gap-4 sm:gap-5">
          <h1
            id="resources-hero-heading"
            className="font-sans text-[30px] font-medium leading-[33px] tracking-[-0.04em] text-foreground sm:text-[46px] sm:leading-[52px] lg:text-[60px] lg:leading-[64px]"
          >
            Resources
            <br />
            <span className="text-foreground/40">
              Built for labeling teams
            </span>
          </h1>
          <p className="max-w-[560px] font-ui text-[15px] leading-[23px] text-muted-foreground sm:text-[17px] sm:leading-[27px] lg:text-lead lg:leading-[30px]">
            Guides, standards references and practical templates organized in
            one place so your team moves from draft to approved label with
            confidence.
          </p>
        </div>
      </TileRow>

      <TileRow
        as="section"
        aria-label="Resource categories"
        splitCenter
        centerClassName="grid grid-cols-1 gap-px md:grid-cols-2"
      >
        {RESOURCES.map((resource) => (
          <Link
            key={resource.id}
            href={resource.href}
            className="group flex flex-col justify-between gap-8 rounded-tile bg-tile px-5 py-7 outline-none transition-colors duration-150 hover:bg-surface-hover/50 focus-visible:ring-2 focus-visible:ring-ring sm:px-8 sm:py-9 lg:px-10 lg:py-10 dark:hover:bg-surface-2"
          >
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors group-hover:border-stroke-strong dark:border-edge-2 dark:bg-surface-2">
                    <Icon icon={resource.icon} size={20} strokeWidth={1.8} />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <h2 className="font-sans text-[22px] font-medium leading-7 tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary dark:group-hover:text-primary-text">
                      {resource.title}
                    </h2>
                    <span className="font-ui text-body-s leading-[18px] text-muted-foreground">
                      {resource.meta}
                    </span>
                  </div>
                </div>

                <span
                  className={
                    resource.available
                      ? "inline-flex h-6 shrink-0 items-center rounded-sm bg-primary/10 px-2 font-mono text-caption font-medium text-primary-700 dark:bg-primary-soft dark:text-primary-text"
                      : "inline-flex h-6 shrink-0 items-center rounded-sm bg-muted px-2 font-mono text-caption text-muted-foreground dark:bg-surface-4"
                  }
                >
                  {resource.available ? "Available" : "Coming soon"}
                </span>
              </div>

              <p className="font-ui text-body-m leading-[22px] text-muted-foreground sm:text-body-l sm:leading-[26px]">
                {resource.description}
              </p>

              <ul className="flex flex-wrap gap-2">
                {resource.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="inline-flex h-6 items-center rounded-sm bg-muted px-2 font-ui text-body-s font-medium text-foreground dark:bg-surface-4"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between border-t border-separator pt-5">
              <span className="font-ui text-body-m font-medium text-foreground transition-colors group-hover:text-primary dark:group-hover:text-primary-text">
                {resource.cta}
              </span>
              <Icon
                icon={ArrowRight02Icon}
                size={15}
                strokeWidth={1.8}
                className="text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground"
              />
            </div>
          </Link>
        ))}
      </TileRow>

      <TileSpacerRow />
    </>
  );
}
