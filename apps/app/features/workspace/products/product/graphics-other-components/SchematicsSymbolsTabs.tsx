"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@uprevit/ui/components/ui/tabs";
import SymbolsGraphicsPageBarcodesTable from "@/features/workspace/products/product/graphics-other-components/SymbolsGraphicsPageBarcodesTable";
import SymbolsGraphicsPageSchematicsTable from "@/features/workspace/products/product/graphics-other-components/SymbolsGraphicsPageSchematicsTable";
import SymbolsGraphicsPageSymbolsTable from "@/features/workspace/products/product/graphics-other-components/SymbolsGraphicsPageSymbolsTable";
import SymbolsGraphicsPageOtherComponentsTable from "./SymbolsGraphicsPageOtherComponentsTable";
import { useState } from "react";

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

  return (
    <Tabs
      defaultValue="tab-1"
      value={activeTab}
      onValueChange={setActiveTab}
      className="flex flex-1 min-h-0 flex-col gap-0"
    >
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <p className="text-sm font-medium">Symbols & Graphics</p>
        <InfoTooltip content="Add and manage product symbols, schematics, barcodes, and other graphical components." />
      </div>

      <div className="flex h-10 shrink-0 items-center border-b border-border px-2">
        <TabsList variant="line">
          <TabsTrigger value="tab-1">Symbols</TabsTrigger>
          <TabsTrigger value="tab-2">Schematics</TabsTrigger>
          <TabsTrigger value="tab-3">Barcodes</TabsTrigger>
          <TabsTrigger value="tab-4">Other Components</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="tab-1"
        className="mt-0 flex flex-1 min-h-0 flex-col overflow-hidden"
      >
        <SymbolsGraphicsPageSymbolsTable
          data={symbolsData}
          productId={productId}
          isSubmitted={isSubmitted}
          isRedlineView={isRedlineView}
        />
      </TabsContent>
      <TabsContent
        value="tab-2"
        className="mt-0 flex flex-1 min-h-0 flex-col overflow-hidden"
      >
        <SymbolsGraphicsPageSchematicsTable
          data={schematicsData}
          productId={productId}
          isSubmitted={isSubmitted}
          isRedlineView={isRedlineView}
        />
      </TabsContent>
      <TabsContent
        value="tab-3"
        className="mt-0 flex flex-1 min-h-0 flex-col overflow-hidden"
      >
        <SymbolsGraphicsPageBarcodesTable
          data={barcodesData}
          productId={productId}
          isSubmitted={isSubmitted}
          isRedlineView={isRedlineView}
        />
      </TabsContent>
      <TabsContent
        value="tab-4"
        className="mt-0 flex flex-1 min-h-0 flex-col overflow-hidden"
      >
        <SymbolsGraphicsPageOtherComponentsTable
          data={otherComponentsData}
          productId={productId}
          isSubmitted={isSubmitted}
          isRedlineView={isRedlineView}
        />
      </TabsContent>
    </Tabs>
  );
}
