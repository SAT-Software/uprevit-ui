import { Wrench01Icon } from "@hugeicons/core-free-icons";
import { ResourceComingSoonSection } from "../ResourceComingSoonSection";

export default function ToolkitsPlaceholder() {
  return (
    <ResourceComingSoonSection
      badge="Toolkits"
      icon={Wrench01Icon}
      title="Labeling toolkits"
      mutedTitle="free for device teams"
      description="A suite of free compliance tools to reduce manual work and keep every label aligned to evolving regulations."
      plannedItems={[
        "Label generator",
        "Compliance checker",
        "Symbol library manager",
        "Audit readiness checks",
      ]}
    />
  );
}
