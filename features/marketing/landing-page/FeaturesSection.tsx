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
          <p className="font-semibold text-muted-foreground/60 mr-8">
            Import your Technical data, source files, label components,
            compliance information and let Uprevit do the rest
          </p>
        </div>
      </div>
      <div className="relative w-full">
        <Card className="w-full h-150 mx-auto border-border max-w-7xl">
          <CardHeader>
            <CardTitle>Demo</CardTitle>
            <CardDescription>Watch a demo of our product</CardDescription>
            <CardContent>
              <p>Watch a demo of our product</p>
            </CardContent>
          </CardHeader>
        </Card>
        <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
      </div>
    </div>
  );
}
