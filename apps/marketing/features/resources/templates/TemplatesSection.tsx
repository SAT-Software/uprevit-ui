import { File02Icon } from "@hugeicons/core-free-icons";
import { ResourceComingSoonSection } from "../ResourceComingSoonSection";

export default function TemplatesSection() {
  return (
    <ResourceComingSoonSection
      badge="Templates"
      icon={File02Icon}
      title="Labeling templates"
      mutedTitle="built for speed"
      description="Ready-to-use checklists and validation kits created by regulatory experts so teams can focus on quality review."
      plannedItems={[
        "Gap assessment checklist",
        "Validation sheet (CSV)",
        "Project timeline template",
        "File naming guide",
      ]}
    />
  );
}
