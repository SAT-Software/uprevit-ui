"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArchivedDepartments from "@/features/workspace/archive/departments/ArchivedDepartments";
import ArchivedProjects from "@/features/workspace/archive/projects/ArchivedProjects";
import ArchivedProducts from "@/features/workspace/archive/products/ArchivedProducts";
import { useState } from "react";
import {
  PiBuildingsDuotone,
  PiFolderDuotone,
  PiCubeDuotone,
} from "react-icons/pi";

function ArchivePage() {
  const [activeTab, setActiveTab] = useState("department");

  const getTabLabel = () => {
    switch (activeTab) {
      case "department":
        return "departments";
      case "project":
        return "projects";
      case "product":
        return "products";
      default:
        return "items";
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <Tabs
        defaultValue="department"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col gap-0 border border-border bg-background rounded-xl w-full h-full overflow-hidden"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">Archive</h1>
            <div className="w-1 h-1 bg-border border border-border rounded-full hidden sm:block" />
            <p className="text-xs text-muted-foreground font-medium">
              Browse archived {getTabLabel()}
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="px-4 py-2">
          <ScrollArea className="w-full">
            <TabsList>
              <TabsTrigger value="department">
                <PiBuildingsDuotone className="me-1.5 h-4 w-4" />
                Departments
              </TabsTrigger>
              <TabsTrigger value="project">
                <PiFolderDuotone className="me-1.5 h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="product">
                <PiCubeDuotone className="me-1.5 h-4 w-4" />
                Products
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden px-4">
          <TabsContent value="department" className="h-full mt-0 pb-4">
            <ArchivedDepartments onRowClick={(row) => console.log(row)} />
          </TabsContent>
          <TabsContent value="project" className="h-full mt-0 pb-4">
            <ArchivedProjects onRowClick={(row) => console.log(row)} />
          </TabsContent>
          <TabsContent value="product" className="h-full mt-0 pb-4">
            <ArchivedProducts onRowClick={(row) => console.log(row)} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default ArchivePage;
