"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import DialogAddLabelTag from "./DialogAddLabelTag";
import DialogEditLabelTag from "./DialogEditLabelTag";
import DialogDeleteLabelTag from "./DialogDeleteLabelTag";
import Image from "next/image";

interface LabelTagItem {
  _id: string;
  name?: string;
  description?: string;
  type?: string;
  image?: string;
}

export default function LabelTagsTabs() {
  const { productId } = useParams();
  const { data, isLoading, error } = useGetProductTabData(
    productId as string,
    "label-tags"
  );
  const [activeTab, setActiveTab] = useState("");

  const effectiveActiveTab =
    activeTab || data?.result?.data?.data?.[0]?.type || "tab-1";

  if (isLoading)
    return <div className="flex flex-col gap-4 p-4">Loading label tags...</div>;

  if (error) return <div>Error loading label tags: {error.message}</div>;

  const labelTagsData: LabelTagItem[] = data?.result?.data?.data;
  const filteredLabelTypesForTabs: string[] = [
    ...new Set(
      labelTagsData
        ?.map((item: LabelTagItem) => item.type)
        ?.filter((type): type is string => !!type)
    ),
  ];

  return (
    <Tabs
      defaultValue="tab-1"
      value={effectiveActiveTab}
      onValueChange={setActiveTab}
    >
      <div className="flex items-center justify-between mb-3">
        <ScrollArea className="flex-1">
          <TabsList className="bg-background h-auto -space-x-px p-0 shadow-none rtl:space-x-reverse">
            {filteredLabelTypesForTabs?.map((type, i) => {
              return (
                <TabsTrigger
                  key={`${i}-${type}`}
                  value={type}
                  className="cursor-pointer border-border data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s-lg last:rounded-e-lg"
                >
                  {type}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <DialogAddLabelTag productId={productId as string} />
      </div>
      {filteredLabelTypesForTabs.map((type) => {
        const currentTabData = labelTagsData.filter(
          (item: LabelTagItem) => item.type === type
        );
        return currentTabData.map((item: LabelTagItem, i) => {
          return (
            <TabsContent key={`${i}-${type}`} value={type}>
              <Card className="w-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        {item.name || "Untitled Label Tag"}
                        <span className="text-base font-normal text-accent-foreground">
                          -
                        </span>
                        <span className="text-base font-normal text-accent-foreground">
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
                        productId={productId as string}
                        labelTag={item}
                      />
                      <DialogDeleteLabelTag
                        productId={productId as string}
                        labelTag={item}
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Label Image
                    </h4>
                    <div className="flex justify-start">
                      {item.image ? (
                        <div className="relative w-full max-w-md">
                          <div className="aspect-square relative overflow-hidden rounded-lg border bg-muted">
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
                        <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-muted rounded-lg border w-full max-w-md">
                          <ImageIcon size={48} className="mb-3 opacity-50" />
                          <p className="text-sm font-medium">
                            No Image Available
                          </p>
                          <p className="text-xs text-center mt-1">
                            Add an image to better visualize this label tag
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
  );
}
