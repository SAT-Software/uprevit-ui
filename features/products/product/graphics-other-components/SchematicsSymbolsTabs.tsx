"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  BoxIcon,
  CircuitBoardIcon,
  BarcodeIcon,
  ShapesIcon,
} from "lucide-react";
import ProductGraphicsAndOtherCompsTable from "@/features/products/product/graphics-other-components/ProductGraphicsAndOtherCompsTable";

interface ComponentData {
  id: string;
  componentName: string;
  componentDescription: string;
  componentImage: string;
  note: string;
}

interface SchematicsSymbolsTabsProps {
  schematicData: ComponentData[];
  barcodesData: ComponentData[];
  otherComponentsData: ComponentData[];
  symbolsData: ComponentData[];
}

export default function SchematicsSymbolsTabs({
  schematicData,
  barcodesData,
  otherComponentsData,
  symbolsData,
}: SchematicsSymbolsTabsProps) {
  const [activeTab, setActiveTab] = useState("tab-1");

  const getButtonText = (tab: string) => {
    switch (tab) {
      case "tab-1":
        return "Add Schematic";
      case "tab-2":
        return "Add Barcode";
      case "tab-3":
        return "Add Component";
      case "tab-4":
        return "Add Symbol";
      default:
        return "Add Item";
    }
  };

  return (
    <Tabs defaultValue="tab-1" value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center justify-between mb-3">
        <ScrollArea className="flex-1">
          <TabsList className="bg-background h-auto -space-x-px p-0 shadow-none rtl:space-x-reverse">
            <TabsTrigger
              value="tab-4"
              className="cursor-pointer  data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s-lg last:rounded-e-lg"
            >
              <ShapesIcon
                className="-ms-0.5 me-1.5 opacity-60 h-4 w-4"
                aria-hidden="true"
              />
              Symbols
            </TabsTrigger>
            <TabsTrigger
              value="tab-1"
              className="cursor-pointer data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <CircuitBoardIcon
                className="-ms-0.5 me-1.5 opacity-60 h-4 w-4"
                aria-hidden="true"
              />
              Schematics
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="cursor-pointer data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <BarcodeIcon
                className="-ms-0.5 me-1.5 opacity-60 h-4 w-4"
                aria-hidden="true"
              />
              Barcodes
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="cursor-pointer  data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e-lg"
            >
              <BoxIcon
                className="-ms-0.5 me-1.5 opacity-60 h-4 w-4"
                aria-hidden="true"
              />
              Other Components
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Button size="sm" variant="secondary" className="text-xs ml-4">
          {getButtonText(activeTab)}
        </Button>
      </div>
      <TabsContent value="tab-1">
        <ProductGraphicsAndOtherCompsTable data={symbolsData} />
      </TabsContent>
      <TabsContent value="tab-2">
        <ProductGraphicsAndOtherCompsTable data={schematicData} />
      </TabsContent>
      <TabsContent value="tab-3">
        <ProductGraphicsAndOtherCompsTable data={barcodesData} />
      </TabsContent>
      <TabsContent value="tab-4">
        <ProductGraphicsAndOtherCompsTable data={otherComponentsData} />
      </TabsContent>
    </Tabs>
  );
}
