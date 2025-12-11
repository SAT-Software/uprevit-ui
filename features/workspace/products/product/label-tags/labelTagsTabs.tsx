"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import DialogAddLabelTag from "./DialogAddLabelTag";
import DialogEditLabelTag from "./DialogEditLabelTag";
import DialogDeleteLabelTag from "./DialogDeleteLabelTag";
import Image from "next/image";
import { PiImageDuotone, PiTagDuotone } from "react-icons/pi";

interface LabelTagItem {
  _id: string;
  name?: string;
  description?: string;
  type?: string;
  image?: string;
}

interface LabelTagsTabsProps {
  labelTagsData: LabelTagItem[];
  productId: string;
  isSubmitted?: boolean;
}

export default function LabelTagsTabs({
  labelTagsData,
  productId,
  isSubmitted = false,
}: LabelTagsTabsProps) {
  const [activeTab, setActiveTab] = useState("");

  const filteredLabelTypesForTabs: string[] = [
    ...new Set(
      labelTagsData
        ?.map((item: LabelTagItem) => item.type)
        ?.filter((type): type is string => !!type)
    ),
  ];

  const effectiveActiveTab =
    activeTab || filteredLabelTypesForTabs[0] || "tab-1";

  // Empty state when no label tags exist
  if (!labelTagsData || labelTagsData.length === 0) {
    return (
      <>
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold">Label Tags</p>
            <div className="w-1 h-1 bg-border border border-border rounded-full" />
            <p className="text-xs text-muted-foreground font-medium">
              Manage label tags and their images for this product
            </p>
          </div>
          <DialogAddLabelTag productId={productId} isSubmitted={isSubmitted} />
        </div>
        <div className="flex flex-col items-center justify-center py-16 gap-4 p-4">
          <div className="p-4 rounded-full bg-muted">
            <PiTagDuotone className="w-10 h-10 text-muted-foreground" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              No Label Tags Added
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Add label tags to organize and visualize different labels for this
              product.
            </p>
          </div>
          <DialogAddLabelTag productId={productId} isSubmitted={isSubmitted} />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold">Label Tags</p>
          <div className="w-1 h-1 bg-border border border-border rounded-full" />
          <p className="text-xs text-muted-foreground font-medium">
            Manage label tags and their images for this product
          </p>
        </div>
        <DialogAddLabelTag productId={productId} isSubmitted={isSubmitted} />
      </div>

      <div className="p-4">
        <Tabs
          defaultValue="tab-1"
          value={effectiveActiveTab}
          onValueChange={setActiveTab}
        >
          <ScrollArea className="flex-1 pb-2">
            <TabsList>
              {filteredLabelTypesForTabs?.map((type, i) => {
                return (
                  <TabsTrigger key={`${i}-${type}`} value={type}>
                    {type}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {filteredLabelTypesForTabs.map((type) => {
            const currentTabData = labelTagsData.filter(
              (item: LabelTagItem) => item.type === type
            );
            return currentTabData.map((item: LabelTagItem, i) => {
              return (
                <TabsContent key={`${i}-${type}`} value={type}>
                  <Card className="w-full shadow-none border-border">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl font-semibold flex items-center gap-2">
                            {item.name || "Untitled Label"}
                            <span className="text-base font-normal text-muted-foreground">
                              -
                            </span>
                            <span className="text-base font-normal text-muted-foreground">
                              {item.description}
                            </span>
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.type || "Unknown Type"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DialogEditLabelTag
                            productId={productId}
                            labelTag={item}
                            isSubmitted={isSubmitted}
                          />
                          <DialogDeleteLabelTag
                            productId={productId}
                            labelTag={item}
                            isSubmitted={isSubmitted}
                          />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Label Image
                        </h4>
                        <div className="flex justify-start">
                          {item.image ? (
                            <div className="relative w-full max-w-md">
                              <div className="aspect-square relative overflow-hidden rounded-lg border border-border bg-muted">
                                <Image
                                  src={item.image}
                                  alt={item.name || "label image"}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-muted/50 rounded-lg border border-border border-dashed w-full max-w-md">
                              <PiImageDuotone className="w-12 h-12 mb-3 opacity-50" />
                              <p className="text-sm font-medium">
                                No Image Available
                              </p>
                              <p className="text-xs text-center mt-1">
                                Add an image to better visualize this label
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            });
          })}
        </Tabs>
      </div>
    </>
  );
}
