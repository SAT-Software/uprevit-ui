import { MarketingSectionBadge } from "@/components/MarketingSectionBadge";
import { Card, CardContent } from "@uprevit/ui/components/ui/card";
import { DecorativeCornerCircle } from "@uprevit/ui/components/ui/DecorativeCornerCircle";
import { Presentation01Icon } from "@hugeicons/core-free-icons";

export default function ReportSection() {
  return (
    <div className="w-full mt-40 mb-20">
      <div className="max-w-6xl flex flex-col items-center mx-auto mb-8 px-2 md:px-2 lg:px-0">
        <MarketingSectionBadge icon={Presentation01Icon} label="Report" />
        <div className="w-full flex flex-col gap-4 items-center justify-center text-2xl">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium">
            Extract powerful reports
          </h2>
          <p className="text-base md:text-lg lg:text-xl font-semibold text-muted-foreground/60 w-full md:w-1/3 text-center tracking-tighter leading-tight">
            Get insights into your data with our powerful reporting tools
          </p>
        </div>
      </div>
      <div className="relative w-full">
        <div className="max-w-6xl mx-auto relative px-2 md:px-2 lg:px-0">
          {/* Bottom-left corner */}
          <DecorativeCornerCircle position="bottom-left" rotation={270} />
          {/* Bottom-right corner */}
          <DecorativeCornerCircle position="bottom-right" rotation={180} />
          {/* Top-left corner */}
          <DecorativeCornerCircle position="top-left" rotation={0} />
          {/* Top-right corner */}
          <DecorativeCornerCircle position="top-right" rotation={90} />

          <div className="p-1 bg-accent border-border border rounded-xl max-w-6xl mx-auto">
            <Card className="aspect-16/8 mx-auto border-border max-w-6xl">
              <CardContent className="p-0 overflow-hidden dark:hidden">
                <video
                  src="/Report-Light-Demo.mp4"
                  className="overflow-hidden rounded-xl"
                  autoPlay
                  loop
                  muted
                />
              </CardContent>
              <CardContent className="p-0 overflow-hidden dark:block hidden">
                <video
                  src="/Report-Dark-Demo.mp4"
                  className="overflow-hidden rounded-xl"
                  autoPlay
                  loop
                  muted
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
      </div>
    </div>
  );
}
