import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PiImageDuotone, PiPresentationChartDuotone } from "react-icons/pi";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ReportSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeVariant =
    mounted && resolvedTheme === "dark" ? "outline" : "white";

  return (
    <div className="w-full mt-40 mb-20">
      <div className="max-w-6xl flex flex-col items-center mx-auto mb-8">
        <Badge
          variant={badgeVariant}
          className="mb-8 z-60 dark:px-2 dark:py-0.5"
        >
          <PiPresentationChartDuotone className="mr-1 text-foreground/50" />
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
        <div className="max-w-6xl mx-auto relative">
          <div className="absolute -bottom-15 -left-15 text-border/60 pointer-events-none hidden md:block rotate-270">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="60"
                cy="60"
                r="58"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="0.8 3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="absolute -bottom-15 -right-15 text-border/60 pointer-events-none hidden md:block rotate-180">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="60"
                cy="60"
                r="58"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="0.8 3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="absolute -top-15 -left-15 text-border/60 pointer-events-none hidden md:block rotate-0">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="60"
                cy="60"
                r="58"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="0.8 3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="absolute -top-15 -right-15 text-border/60 pointer-events-none hidden md:block rotate-90">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="60"
                cy="60"
                r="58"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="0.8 3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="p-1 bg-accent border-border border rounded-[12px] max-w-6xl mx-auto">
            <Card className="aspect-16/8 mx-auto border-border max-w-6xl">
              <CardContent className="p-0 overflow-hidden">
                <video
                  src="/uprevit-test-demo-2.mp4"
                  className="overflow-hidden rounded-[8px]"
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
