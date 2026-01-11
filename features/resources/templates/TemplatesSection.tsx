"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PiDownloadDuotone, PiFileTextDuotone, PiCheckCircleDuotone } from "react-icons/pi";

const templates = [
  {
    category: "Checklist & Templates",
    items: [
      {
        title: "Gap Assessment Checklist - Basic",
        description: "Identify compliance gaps in your labeling process with this comprehensive checklist.",
        type: "checklist",
      },
      {
        title: "Validation Template (CSV)",
        description: "Structured template for validating label data and ensuring accuracy.",
        type: "template",
      },
      {
        title: "Project Timeline & Gantt Template",
        description: "Plan and track your labeling projects with this visual timeline template.",
        type: "template",
      },
      {
        title: "Standard File Naming Nomenclatures",
        description: "Consistent naming conventions for medical device documentation.",
        type: "guide",
      },
    ],
  },
];

const tags = ["All", "Checklist", "Template", "Guide", "Validation"];

export default function TemplatesSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => {
    setMounted(true);
  }, []);

  const badgeVariant = mounted && resolvedTheme === "dark" ? "outline" : "white";

  return (
    <div className="w-full mt-10 mb-20 pointer-events-auto">
      <div className="max-w-6xl mx-auto mb-8 px-4">
        <Badge variant={badgeVariant} className="mb-8 z-60 dark:px-2 dark:py-0.5">
          <span className="font-medium">Templates</span>
        </Badge>
        <div className="w-full flex flex-col md:flex-row items-start gap-4">
          <h2 className="text-4xl md:text-5xl font-medium">
            Practical Toolkits & Templates
          </h2>
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
          The Regulatory Toolkit: Build Compliance Faster. Gain immediate access to a library of
          battle-tested templates and checklists, designed by regulatory experts. Stop building
          documents from scratch; simply leverage these verified assets for your medical device
          documentation.
        </p>
      </div>

      {/* Tags */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Button
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTag(tag)}
              className="rounded-full"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Accordion */}
      <div className="max-w-6xl mx-auto px-4">
        <Accordion type="single" defaultValue="checklist-templates" className="w-full">
          {templates.map((section, index) => (
            <AccordionItem key={index} value={section.category.toLowerCase().replace(/\s+/g, "-")}>
              <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-2">
                  <PiCheckCircleDuotone className="w-5 h-5" />
                  {section.category}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {section.items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-start gap-2">
                          <PiFileTextDuotone className="w-5 h-5 mt-0.5 text-primary" />
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">
                          {item.description}
                        </CardDescription>
                        <Button variant="outline" size="sm" className="w-full">
                          <PiDownloadDuotone className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
