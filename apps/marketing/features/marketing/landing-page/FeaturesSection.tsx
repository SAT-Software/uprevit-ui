import { MarketingSectionBadge } from "@/components/MarketingSectionBadge";
import { DecorativeCornerCircleCustom } from "@uprevit/ui/components/ui/DecorativeCornerCircle";
import { StarSquareIcon } from "@hugeicons/core-free-icons";
import { AutomatedRedliningCard } from "./AutomatedRedliningCard";
import { VersionControlCards } from "./VersionControlCards";
import { Worksteps } from "./Worksteps";
import { LabelDataTaggingCard } from "./LabelDataTaggingCard";

export default function FeaturesSection() {
  return (
    <div className="w-full mt-40 mb-20 pointer-events-auto">
      <div className="max-w-6xl mx-auto mb-8 px-2 md:px-2 lg:px-0">
        <MarketingSectionBadge icon={StarSquareIcon} label="Features" />
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-start text-2xl">
          <h2 className="text-2xl md:text-4xl lg:text-5xl md:w-[55%] font-medium mr-12 mb-4 md:mb-0 text-balance">
            Turn raw data into Notified Body ready document
          </h2>
          <div className="hidden lg:block mr-10 h-16 w-px bg-border shrink-0" />
          <p className="text-base md:text-lg lg:text-xl md:flex-1 font-normal text-muted-foreground/60 mr-4">
            Unify your data, your workflow. Stop managing scattered documents
            and start managing results
          </p>
        </div>
      </div>
      <div className="relative w-full">
        <div className="max-w-6xl mx-auto relative px-2 md:px-2 lg:px-0">
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

          <div className="p-1 bg-muted rounded-2xl max-w-6xl mx-auto border border-border shadow-bottom-lg">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col lg:flex-row w-full h-250 lg:h-130 gap-1">
                <AutomatedRedliningCard />
                <VersionControlCards />
              </div>
              <div className="flex flex-col lg:flex-row w-full h-250 lg:h-130 gap-1">
                <Worksteps className="w-full lg:w-1/3" />
                <LabelDataTaggingCard className="w-full lg:w-2/3" />
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
