import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PiImageDuotone } from "react-icons/pi";

export default function DemoSection() {
  return (
    <div className="w-full mt-40 mb-20">
      <div className="max-w-7xl mx-auto mb-8">
        <Badge variant="white" className="mb-8 z-60">
          <PiImageDuotone className="mr-1 text-foreground/50" />
          <span className="font-medium">Uprevit Demo</span>
        </Badge>
        <div className="w-full flex items-center justify-start text-2xl">
          <h2 className="text-5xl w-1/2 font-medium">
            The FastTrack way to Global labeling compliance
          </h2>
          <div className="mr-8 h-16 w-px bg-border" />
          <p className="font-semibold text-muted-foreground/60">
            Command Your Labels. <br /> Command Your Compliance.
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
