"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PiImagesDuotone, PiFileTextDuotone, PiLinkDuotone } from "react-icons/pi";

const symbols = [
  {
    title: "Global Compliance Iconography",
    description: "Ensure universal understanding and regulatory adherence with our comprehensive library of standardized medical device symbols.",
    usage: "LinkedIn Ref, Cue Cards & Usage",
  },
];

const isoDocuments = [
  {
    title: "ISO 15223-1:2021",
    description: "Symbols to be used with medical devices, labels, and labeling.",
  },
  {
    title: "ISO 7000:2014",
    description: "Graphical symbols for use on equipment - Registered symbols.",
  },
  {
    title: "ISO 7001:2008",
    description: "Public information symbols.",
  },
  {
    title: "ISO 7010:2019",
    description: "Graphical symbols - Safety colors and safety signs.",
  },
];

export default function StandardsSymbolsSection() {
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
          <span className="font-medium">Standards & Symbols</span>
        </Badge>
        <div className="w-full flex flex-col md:flex-row items-start gap-4">
          <h2 className="text-4xl md:text-5xl font-medium">
            Standards & Regulatory Symbols
          </h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <Tabs defaultValue="symbols" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="symbols">Symbol Library</TabsTrigger>
            <TabsTrigger value="iso">ISO Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="symbols" className="mt-6">
            <div className="space-y-6">
              {symbols.map((symbol, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PiImagesDuotone className="w-6 h-6 text-primary" />
                      {symbol.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {symbol.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                      <PiLinkDuotone className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{symbol.usage}</span>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline">
                        Browse Symbol Library
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="iso" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiFileTextDuotone className="w-6 h-6 text-primary" />
                  ISO Documents Repository
                </CardTitle>
                <CardDescription className="text-base">
                  Access the complete, up-to-date library of critical ISO standards relevant to
                  medical device labeling and compliance, all in one centralized location.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isoDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <h4 className="font-semibold">{doc.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {doc.description}
                      </p>
                      <Button variant="link" size="sm" className="mt-2 px-0">
                        View Document
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
