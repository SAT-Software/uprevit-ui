import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PiImageDuotone } from "react-icons/pi";

export default function FeaturesSection() {
  return (
    <div className="w-full mt-40 mb-20">
      <div className="max-w-7xl mx-auto mb-8">
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
        <div className="p-1 bg-accent rounded-xl max-w-7xl mx-auto border border-border">
          <div className="flex flex-col gap-1">
            <div className="flex w-full h-130 gap-1">
              <div className="w-2/3 h-full bg-background p-10 rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Automated- Redlining
                </h3>
                <p className="w-1/2 text-muted-foreground">
                  No manual redlining of older versions. Get automated redlining
                  copy with master version
                </p>
              </div>
              <div className="w-1/3 h-full bg-background p-10 rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Version control perfected
                </h3>
                <p className="w-2/3 text-muted-foreground">
                  Version-controlled product data and live progress tracking
                </p>
              </div>
            </div>
            <div className="flex w-full h-130 gap-1">
              <div className="w-1/3 h-full bg-background p-10 rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Labeling Asset Management
                </h3>
                <p className="w-2/3 text-muted-foreground">
                  Your source of truth for all symbols, schematics, graphics
                </p>
              </div>
              <div className="w-2/3 h-full bg-background p-10 rounded-xl border border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Label data tagging
                </h3>
                <p className="w-1/2 text-muted-foreground">
                  Generate perfect label samples and mock-ups by tagging
                  existing, approved master label elements.
                </p>
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
