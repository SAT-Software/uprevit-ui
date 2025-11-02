"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SymbolsGraphicsPageBarcodesTable from "@/features/products/product/graphics-other-components/SymbolsGraphicsPageBarcodesTable";
import SymbolsGraphicsPageSchematicsTable from "@/features/products/product/graphics-other-components/SymbolsGraphicsPageSchematicsTable";
import SymbolsGraphicsPageSymbolsTable from "@/features/products/product/graphics-other-components/SymbolsGraphicsPageSymbolsTable";
import AddSymbolsDialog from "@/features/products/product/graphics-other-components/AddSymbolsDialog";
import AddSchematicsDialog from "@/features/products/product/graphics-other-components/AddSchematicsDialog";
import AddBarcodesDialog from "@/features/products/product/graphics-other-components/AddBarcodesDialog";
import AddOtherCompsDialog from "@/features/products/product/graphics-other-components/AddOtherCompsDialog";
import {
  BarcodeIcon,
  BoxIcon,
  CircuitBoardIcon,
  ShapesIcon,
} from "lucide-react";
import { useState } from "react";
import SymbolsGraphicsPageOtherComponentsTable from "./SymbolsGraphicsPageOtherComponentsTable";

interface SymbolData {
  id: string;
  componentName: string;
  componentImage: string;
  symbolsTextPresent: string[];
  textPresent: boolean;
}

interface SchematicData {
  id: string;
  componentName: string;
  componentDescription: string;
  componentImage: string;
  presentOnLabels: string[];
}

interface BarcodesData {
  id: string;
  componentName: string;
  componentDescription: string;
  componentImage: string;
  presentOnLabels: string[];
}

interface OtherComponentData {
  id: string;
  componentName: string;
  componentDescription: string;
  componentImage: string;
  presentOnLabels: string[];
}

interface SchematicsSymbolsTabsProps {
  schematicsData: SchematicData[];
  barcodesData: BarcodesData[];
  otherComponentsData: OtherComponentData[];
  symbolsData: SymbolData[];
  productId: string;
}

export default function SchematicsSymbolsTabs({
  schematicsData,
  barcodesData,
  otherComponentsData,
  symbolsData,
  productId,
}: SchematicsSymbolsTabsProps) {
  const [activeTab, setActiveTab] = useState("tab-1");

  console.log("other comp data in Tabs", otherComponentsData);

  return (
    <Tabs defaultValue="tab-1" value={activeTab} onValueChange={setActiveTab}>
      <div className="flex items-center justify-between mb-3">
        <ScrollArea className="flex-1">
          <TabsList className="bg-background h-auto -space-x-px p-0 shadow-none rtl:space-x-reverse">
            <TabsTrigger
              value="tab-1"
              className="cursor-pointer border-border data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s-lg last:rounded-e-lg"
            >
              <ShapesIcon
                className="-ms-0.5 me-1.5 opacity-60 h-4 w-4"
                aria-hidden="true"
              />
              Symbols
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="cursor-pointer border-border data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <CircuitBoardIcon
                className="-ms-0.5 me-1.5 opacity-60 h-4 w-4"
                aria-hidden="true"
              />
              Schematics
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="cursor-pointer border-border data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
            >
              <BarcodeIcon
                className="-ms-0.5 me-1.5 opacity-60 h-4 w-4"
                aria-hidden="true"
              />
              Barcodes
            </TabsTrigger>
            <TabsTrigger
              value="tab-4"
              className="cursor-pointer border-border data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e-lg"
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
        {activeTab === "tab-1" ? (
          <AddSymbolsDialog productId={productId} />
        ) : activeTab === "tab-2" ? (
          <AddSchematicsDialog productId={productId} />
        ) : activeTab === "tab-3" ? (
          <AddBarcodesDialog productId={productId} />
        ) : (
          activeTab === "tab-4" && <AddOtherCompsDialog productId={productId} />
        )}
      </div>
      <TabsContent value="tab-1">
        <SymbolsGraphicsPageSymbolsTable data={symbolsData} />
      </TabsContent>
      <TabsContent value="tab-2">
        <SymbolsGraphicsPageSchematicsTable data={schematicsData} />
      </TabsContent>
      <TabsContent value="tab-3">
        <SymbolsGraphicsPageBarcodesTable data={barcodesData} />
      </TabsContent>
      <TabsContent value="tab-4">
        <SymbolsGraphicsPageOtherComponentsTable data={otherComponentsData} />
      </TabsContent>
    </Tabs>
  );
}
