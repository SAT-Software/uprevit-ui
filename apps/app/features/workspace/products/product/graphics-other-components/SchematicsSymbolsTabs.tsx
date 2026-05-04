"use client";

import { ScrollArea, ScrollBar } from "@uprevit/ui/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@uprevit/ui/components/ui/tabs";
import SymbolsGraphicsPageBarcodesTable from "@/features/workspace/products/product/graphics-other-components/SymbolsGraphicsPageBarcodesTable";
import SymbolsGraphicsPageSchematicsTable from "@/features/workspace/products/product/graphics-other-components/SymbolsGraphicsPageSchematicsTable";
import SymbolsGraphicsPageSymbolsTable from "@/features/workspace/products/product/graphics-other-components/SymbolsGraphicsPageSymbolsTable";
import AddSymbolsDialog from "@/features/workspace/products/product/graphics-other-components/AddSymbolsDialog";
import AddSchematicsDialog from "@/features/workspace/products/product/graphics-other-components/AddSchematicsDialog";
import AddBarcodesDialog from "@/features/workspace/products/product/graphics-other-components/AddBarcodesDialog";
import AddOtherCompsDialog from "@/features/workspace/products/product/graphics-other-components/AddOtherCompsDialog";
import { PageInfoDialog } from "@/features/workspace/products/product/PageInfoDialog";
import {
  PiShapesDuotone,
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
  key?: string;
  symbolsTextPresent: string[];
  textPresent: boolean;
  standard_symbol_id?: string;
  standard_ref_number?: string;
}

interface SchematicData {
  id: string;
  componentName: string;
  componentDescription: string;
  componentImage: string;
  key?: string;
  presentOnLabels: string[];
}

interface BarcodesData {
  id: string;
  componentName: string;
  componentDescription: string;
  componentImage: string;
  key?: string;
  presentOnLabels: string[];
  count?: number;
}

interface OtherComponentData {
  id: string;
  componentName: string;
  componentDescription: string;
  componentImage: string;
  key?: string;
  presentOnLabels: string[];
}

interface SchematicsSymbolsTabsProps {
  schematicsData: SchematicData[];
  barcodesData: BarcodesData[];
  otherComponentsData: OtherComponentData[];
  symbolsData: SymbolData[];
  productId: string;
  isSubmitted?: boolean;
  isRedlineView?: boolean;
}

export default function SchematicsSymbolsTabs({
  schematicsData,
  barcodesData,
  otherComponentsData,
  symbolsData,
  productId,
  isSubmitted = false,
  isRedlineView = false,
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
      className="flex h-full min-h-0 flex-col gap-0"
    >
      {/* Header Section */}
      <div className="flex shrink-0 items-center justify-between border-b border-border p-2">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold">Symbols & Graphics</p>
          <div className="w-1 h-1 bg-border border border-border rounded-full" />
          <p className="text-xs text-muted-foreground font-medium">
            Manage {getTabLabel()} for this product
          </p>
          <PageInfoDialog
            title="Symbols & Graphics"
            content="Add and manage product symbols, schematics, barcodes, and other graphical components."
          />
        </div>
        {activeTab === "tab-1" ? (
          <AddSymbolsDialog
            productId={productId}
            isSubmitted={isSubmitted}
            existingSymbols={symbolsData}
          />
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
      <div className="shrink-0 px-2 py-2">
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
      <div className="flex-1 min-h-0 overflow-hidden px-2 pb-2">
        <TabsContent value="tab-1" className="mt-0 flex h-full min-h-0 flex-col">
          <SymbolsGraphicsPageSymbolsTable
            data={symbolsData}
            isSubmitted={isSubmitted}
            isRedlineView={isRedlineView}
          />
        </TabsContent>
        <TabsContent value="tab-2" className="mt-0 flex h-full min-h-0 flex-col">
          <SymbolsGraphicsPageSchematicsTable
            data={schematicsData}
            isSubmitted={isSubmitted}
            isRedlineView={isRedlineView}
          />
        </TabsContent>
        <TabsContent value="tab-3" className="mt-0 flex h-full min-h-0 flex-col">
          <SymbolsGraphicsPageBarcodesTable
            data={barcodesData}
            isSubmitted={isSubmitted}
            isRedlineView={isRedlineView}
          />
        </TabsContent>
        <TabsContent value="tab-4" className="mt-0 flex h-full min-h-0 flex-col">
          <SymbolsGraphicsPageOtherComponentsTable
            data={otherComponentsData}
            isSubmitted={isSubmitted}
            isRedlineView={isRedlineView}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
