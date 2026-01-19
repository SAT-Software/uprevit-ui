"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SymbolsGraphicsPageBarcodesTable from "@/features/workspace/products/product/graphics-other-components/SymbolsGraphicsPageBarcodesTable";
import SymbolsGraphicsPageSchematicsTable from "@/features/workspace/products/product/graphics-other-components/SymbolsGraphicsPageSchematicsTable";
import SymbolsGraphicsPageSymbolsTable from "@/features/workspace/products/product/graphics-other-components/SymbolsGraphicsPageSymbolsTable";
import AddSymbolsDialog from "@/features/workspace/products/product/graphics-other-components/AddSymbolsDialog";
import AddSchematicsDialog from "@/features/workspace/products/product/graphics-other-components/AddSchematicsDialog";
import AddBarcodesDialog from "@/features/workspace/products/product/graphics-other-components/AddBarcodesDialog";
import AddOtherCompsDialog from "@/features/workspace/products/product/graphics-other-components/AddOtherCompsDialog";
import {
  PiShapesDuotone,
  PiCpuDuotone,
  PiBarcodeDuotone,
  PiCubeDuotone,
  PiCubeTransparentDuotone,
} from "react-icons/pi";
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
  count?: number;
}

interface OtherComponentData {
  id: string;
  componentName: string;
  componentDescription: string;
  componentImage: string;
  presentOnLabels: string[];
}

interface DiffItem {
  path: string;
  status: "added" | "removed" | "modified";
  old_value?: any;
  new_value?: any;
}

interface SchematicsSymbolsTabsProps {
  schematicsData: SchematicData[];
  barcodesData: BarcodesData[];
  otherComponentsData: OtherComponentData[];
  symbolsData: SymbolData[];
  productId: string;
  isSubmitted?: boolean;
  isRedlineView?: boolean;
  diffs?: DiffItem[];
}

export default function SchematicsSymbolsTabs({
  schematicsData,
  barcodesData,
  otherComponentsData,
  symbolsData,
  productId,
  isSubmitted = false,
  isRedlineView = false,
  diffs = [],
}: SchematicsSymbolsTabsProps) {
  const [activeTab, setActiveTab] = useState("tab-1");

  // Get the current tab label for the description
  const getTabLabel = () => {
    switch (activeTab) {
      case "tab-1":
        return "symbols";
      case "tab-2":
        return "schematics";
      case "tab-3":
        return "barcodes";
      case "tab-4":
        return "other components";
      default:
        return "items";
    }
  };

  return (
    <Tabs
      defaultValue="tab-1"
      value={activeTab}
      onValueChange={setActiveTab}
      className="flex flex-col h-full gap-0"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-border p-2">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold">Symbols & Graphics</p>
          <div className="w-1 h-1 bg-border border border-border rounded-full" />
          <p className="text-xs text-muted-foreground font-medium">
            Manage {getTabLabel()} for this product
          </p>
        </div>
        {activeTab === "tab-1" ? (
          <AddSymbolsDialog productId={productId} isSubmitted={isSubmitted} />
        ) : activeTab === "tab-2" ? (
          <AddSchematicsDialog
            productId={productId}
            isSubmitted={isSubmitted}
          />
        ) : activeTab === "tab-3" ? (
          <AddBarcodesDialog productId={productId} isSubmitted={isSubmitted} />
        ) : (
          activeTab === "tab-4" && (
            <AddOtherCompsDialog
              productId={productId}
              isSubmitted={isSubmitted}
            />
          )
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="px-2 py-2">
        <ScrollArea className="w-full">
          <TabsList>
            <TabsTrigger value="tab-1">
              <PiCubeTransparentDuotone
                className="me-1.5 h-4 w-4"
                aria-hidden="true"
              />
              Symbols
            </TabsTrigger>
            <TabsTrigger value="tab-2">
              <PiShapesDuotone className="me-1.5 h-4 w-4" aria-hidden="true" />
              Schematics
            </TabsTrigger>
            <TabsTrigger value="tab-3">
              <PiBarcodeDuotone className="me-1.5 h-4 w-4" aria-hidden="true" />
              Barcodes
            </TabsTrigger>
            <TabsTrigger value="tab-4">
              <PiCubeDuotone className="me-1.5 h-4 w-4" aria-hidden="true" />
              Other Components
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-hidden px-2">
        <TabsContent value="tab-1" className="h-full mt-0">
          <SymbolsGraphicsPageSymbolsTable
            data={symbolsData}
            isSubmitted={isSubmitted}
            isRedlineView={isRedlineView}
            diffs={diffs}
          />
        </TabsContent>
        <TabsContent value="tab-2" className="h-full mt-0">
          <SymbolsGraphicsPageSchematicsTable
            data={schematicsData}
            isSubmitted={isSubmitted}
            isRedlineView={isRedlineView}
            diffs={diffs}
          />
        </TabsContent>
        <TabsContent value="tab-3" className="h-full mt-0">
          <SymbolsGraphicsPageBarcodesTable
            data={barcodesData}
            isSubmitted={isSubmitted}
            isRedlineView={isRedlineView}
            diffs={diffs}
          />
        </TabsContent>
        <TabsContent value="tab-4" className="h-full mt-0">
          <SymbolsGraphicsPageOtherComponentsTable
            data={otherComponentsData}
            isSubmitted={isSubmitted}
            isRedlineView={isRedlineView}
            diffs={diffs}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
