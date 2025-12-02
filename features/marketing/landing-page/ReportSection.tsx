import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PiImageDuotone } from "react-icons/pi";

export default function ReportSection() {
  return (
    <div className="w-full mt-40 mb-20">
      <div className="max-w-7xl flex flex-col items-center mx-auto mb-8">
        <Badge variant="white" className="mb-8 z-60">
          <PiImageDuotone className="mr-1 text-foreground/50" />
          <span className="font-medium">Report</span>
        </Badge>
        <div className="w-full flex flex-col gap-4 items-center justify-center text-2xl">
          <h2 className="text-5xl font-medium">Extract powerful reports</h2>
          <p className="font-semibold text-muted-foreground/60 w-1/3 text-center tracking-tighter leading-tight">
            Get insights into your data with our powerful reporting tools
          </p>
        </div>
      </div>
      <div className="relative w-full">
        <Card className="w-full h-150 mx-auto border-border max-w-7xl">
          <CardHeader>
            <CardTitle>Report</CardTitle>
            <CardDescription>Generate powerful reports</CardDescription>
            <CardContent>
              <p>Generate powerful reports</p>
            </CardContent>
          </CardHeader>
        </Card>
        <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
      </div>
    </div>
  );
}
