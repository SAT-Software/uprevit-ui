"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PiFilesDuotone, PiBookOpenDuotone, PiNewspaperDuotone, PiWrenchDuotone } from "react-icons/pi";
import Link from "next/link";

const resources = [
  {
    id: "templates",
    title: "Templates",
    description: "Access battle-tested checklists and templates designed by regulatory experts. Stop building documents from scratch.",
    icon: PiFilesDuotone,
    href: "/resources/templates",
  },
  {
    id: "standards-symbols",
    title: "Standards & Symbols",
    description: "Complete ISO standards library and standardized medical device symbols for universal compliance understanding.",
    icon: PiBookOpenDuotone,
    href: "/resources/standards-symbols",
  },
  {
    id: "blogs",
    title: "Blogs",
    description: "Expert analysis of regulatory shifts and industry insights to help you stay ahead of compliance changes.",
    icon: PiNewspaperDuotone,
    href: "/resources/blogs",
  },
  {
    id: "toolkits",
    title: "Toolkits",
    description: "Free compliance tools to streamline your labeling workflow. Coming soon!",
    icon: PiWrenchDuotone,
    href: "/resources/toolkits",
  },
];

export default function ResourcesHub() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeVariant = mounted && resolvedTheme === "dark" ? "outline" : "white";

  return (
    <div className="w-full mt-20 mb-20 pointer-events-auto">
      <div className="max-w-6xl mx-auto mb-8 px-4">
        <Badge variant={badgeVariant} className="mb-8 z-60 dark:px-2 dark:py-0.5">
          <span className="font-medium">Resources</span>
        </Badge>
        <div className="w-full flex flex-col md:flex-row items-start gap-4">
          <h2 className="text-4xl md:text-5xl font-medium">
            Everything You Need for Compliance
          </h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <resource.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {resource.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Link href={resource.href}>
                  <Button variant="outline">Learn More</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
