"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PiWrenchDuotone, PiClockDuotone } from "react-icons/pi";

const upcomingTools = [
  {
    title: "Label Generator",
    description: "Create compliant medical device labels with automatic symbol inclusion and regulatory validation.",
    status: "In Development",
  },
  {
    title: "Compliance Checker",
    description: "Automated validation of your labels against FDA, EU MDR, and other regulatory requirements.",
    status: "Planned",
  },
  {
    title: "Symbol Library Manager",
    description: "Organize and manage your organization's symbol library with version control and approval workflows.",
    status: "Planned",
  },
];

export default function ToolkitsPlaceholder() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeVariant = mounted && resolvedTheme === "dark" ? "outline" : "white";

  return (
    <div className="w-full mt-10 mb-20 pointer-events-auto">
      <div className="max-w-6xl mx-auto mb-8 px-4">
        <Badge variant={badgeVariant} className="mb-8 z-60 dark:px-2 dark:py-0.5">
          <span className="font-medium">Toolkits</span>
        </Badge>
        <div className="w-full flex flex-col md:flex-row items-start gap-4">
          <h2 className="text-4xl md:text-5xl font-medium">
            Free Compliance Tools
          </h2>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
          Powerful tools to streamline your labeling workflow. All tools are free to use and designed
          specifically for medical device regulatory compliance.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <PiWrenchDuotone className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground text-center max-w-md">
              We&apos;re working on building powerful free tools to help you with your compliance needs.
              Stay tuned for updates!
            </p>
          </CardContent>
        </Card>

        {/* Upcoming Tools Preview */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-6">What&apos;s Coming</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingTools.map((tool, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PiClockDuotone className="w-5 h-5 text-muted-foreground" />
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {tool.status}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
