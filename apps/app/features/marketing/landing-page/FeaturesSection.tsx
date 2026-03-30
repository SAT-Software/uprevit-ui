import { Badge } from "@uprevit/ui/components/ui/badge";
import { DecorativeCornerCircleCustom } from "@uprevit/ui/components/ui/DecorativeCornerCircle";
import { PiBoundingBoxDuotone } from "react-icons/pi";
import { AutomatedRedliningCard } from "./AutomatedRedliningCard";
import { VersionControlCards } from "./VersionControlCards";
import { Worksteps } from "./Worksteps";
import { LabelDataTaggingCard } from "./LabelDataTaggingCard";

export default function FeaturesSection() {
  return (
    <div className="w-full mt-40 mb-20 pointer-events-auto">
      <div className="max-w-6xl mx-auto mb-8">
        <Badge
          variant="outline"
          className="mb-8 z-60 bg-white text-foreground shadow-md px-2 py-0.5 dark:bg-transparent"
        >
          <PiBoundingBoxDuotone className="mr-1 text-foreground/50" />
          <span className="font-medium">Features</span>
        </Badge>
        <div className="w-full flex items-center justify-start text-2xl">
          <h2 className="text-5xl w-full font-medium">
            Turn raw data into Notified Body ready document
          </h2>
          <div className="mx-8 h-24 w-px bg-border" />
          <p className="font-semibold text-muted-foreground/60 mr-8 tracking-tighter leading-tight">
            Unify your data, Uprevit your workflow. Stop managing scattered
            source files and start managing results
          </p>
        </div>
      </div>
      <div className="relative w-full">
        <div className="max-w-6xl mx-auto relative">
          {/* Inner bottom-left corner */}
          <DecorativeCornerCircleCustom
            positionClassName="bottom-0 -left-15"
            rotation={0}
          />
          {/* Inner bottom-right corner */}
          <DecorativeCornerCircleCustom
            positionClassName="bottom-0 -right-15"
            rotation={90}
          />
          {/* Outer bottom-left corner */}
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-15 left-0"
            rotation={180}
          />
          {/* Outer bottom-right corner */}
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-15 right-0"
            rotation={270}
          />

          <div className="p-1 bg-accent rounded-[12px] max-w-6xl mx-auto border border-border">
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
        </div>
        <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
      </div>
    </div>
  );
}
