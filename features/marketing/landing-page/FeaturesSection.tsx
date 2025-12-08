import { Badge } from "@/components/ui/badge";
import { PiImageDuotone } from "react-icons/pi";
import { AutomatedRedliningCard } from "./AutomatedRedliningCard";
import { VersionControlCards } from "./VersionControlCards";
import { Worksteps } from "./Worksteps";
import { LabelDataTaggingCard } from "./LabelDataTaggingCard";

export default function FeaturesSection() {
  return (
    <div className="w-full mt-40 mb-20">
      <div className="max-w-6xl mx-auto mb-8">
        <Badge variant="white" className="mb-8 z-60">
          <PiImageDuotone className="mr-1 text-foreground/50" />
          <span className="font-medium">Features</span>
        </Badge>
        <div className="w-full flex items-center justify-start text-2xl">
          <h2 className="text-5xl w-full font-medium">
            Turn raw data into Notified Body ready document
          </h2>
          <div className="mx-8 h-24 w-px bg-border" />
          <p className="font-semibold text-muted-foreground/60 mr-8 tracking-tighter leading-tight">
            Import your Technical data, source files, label components,
            compliance information and let Uprevit do the rest
          </p>
        </div>
      </div>
      <div className="relative w-full">
        <div className="p-1 bg-accent rounded-xl max-w-6xl mx-auto border border-border">
          <div className="flex flex-col gap-1">
            <div className="flex w-full h-130 gap-1">
              <AutomatedRedliningCard />
              <VersionControlCards />
            </div>
            <div className="flex w-full h-130 gap-1">
              <Worksteps className="w-1/3" />
              <LabelDataTaggingCard className="w-2/3" />
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
      </div>
    </div>
  );
}
