import { BookOpen02Icon } from "@hugeicons/core-free-icons";
import { ResourceComingSoonSection } from "../ResourceComingSoonSection";

export default function StandardsSymbolsSection() {
  return (
    <ResourceComingSoonSection
      badge="Standards & Symbols"
      icon={BookOpen02Icon}
      title="Standards & symbols"
      mutedTitle="for global compliance"
      description="Centralize symbol guidance and ISO references in one place so teams can label confidently across markets."
      plannedItems={[
        "ISO 15223-1 symbols",
        "EU MDR & FDA guidance",
        "Packaging & handling marks",
        "UDI & traceability notes",
      ]}
    />
  );
}
