"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArchivedItems from "@/features/archive/ArchivedItems";

function ArchivePage() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Archive</h1>
          <p className="text-sm text-muted-foreground">
            Browse archived department, projects and products.
          </p>
        </div>
      </div>

      <Tabs defaultValue="department" className="w-full">
        <TabsList>
          <TabsTrigger value="department">Departments</TabsTrigger>
          <TabsTrigger value="project">Projects</TabsTrigger>
          <TabsTrigger value="product">Products</TabsTrigger>
        </TabsList>
        <TabsContent value="product">
          <ArchivedItems
            type="product"
            onRowClick={(row) => console.log(row)}
          />
        </TabsContent>
        <TabsContent value="department">
          <ArchivedItems
            type="department"
            onRowClick={(row) => console.log(row)}
          />
        </TabsContent>
        <TabsContent value="project">
          <ArchivedItems
            type="project"
            onRowClick={(row) => console.log(row)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ArchivePage;
