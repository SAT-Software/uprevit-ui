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

const symbolsGraphicsTabTriggerClassName =
  "flex-none h-7 shrink-0 rounded-lg px-2 text-sm font-medium text-foreground/40 shadow-none transition-colors hover:text-foreground/60 data-[state=active]:bg-foreground/[0.08] data-[state=active]:text-foreground data-[state=active]:shadow-none group-data-[variant=line]/tabs-list:data-[state=active]:!bg-foreground/[0.08] after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[9px] after:z-10 after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 data-[state=active]:after:opacity-100";

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
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-background p-2 pl-3">
        <p className="text-sm font-medium">Symbols & Graphics</p>
        <InfoTooltip content="Add and manage product symbols, schematics, barcodes, and other graphical components." />
      </div>

      <div className="flex shrink-0 items-end border-b border-border px-2 py-2">
        <TabsList variant="line" className="h-auto gap-0.5 bg-transparent p-0">
          <TabsTrigger
            value="tab-1"
            className={symbolsGraphicsTabTriggerClassName}
          >
            Symbols
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className={symbolsGraphicsTabTriggerClassName}
          >
            Schematics
          </TabsTrigger>
          <TabsTrigger
            value="tab-3"
            className={symbolsGraphicsTabTriggerClassName}
          >
            Barcodes
          </TabsTrigger>
          <TabsTrigger
            value="tab-4"
            className={symbolsGraphicsTabTriggerClassName}
          >
            Other Components
          </TabsTrigger>
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
