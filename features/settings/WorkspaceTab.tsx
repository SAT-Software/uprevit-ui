"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

function WorkspaceTab() {
  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex items-center gap-6 p-6 bg-accent rounded-lg border">
        <div className="relative">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-lg">
              <Image
                src="/avatars/workspace-logo.png"
                alt="Workspace Logo"
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-full"
              />
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 16v-4m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-semibold">MedTech Solutions Inc.</h2>
            <Badge variant="default">Enterprise</Badge>
          </div>
          <p className="text-muted-foreground">
            Manage your workspace settings and organization details.
          </p>
        </div>
      </div>

      {/* Workspace Information */}
      <div className="space-y-4">
        <div className="font-medium">Workspace Information</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Workspace Name</label>
            <Input
              type="text"
              value="MedTech Solutions Inc."
              placeholder="Enter workspace name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company ID</label>
            <Input
              type="text"
              value="MTS-2024-001"
              placeholder="Enter company ID"
              className="w-full"
              disabled
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Workspace Description</label>
            <Textarea
              value="Leading medical device company specializing in innovative healthcare solutions and regulatory compliance for medical labeling and documentation."
              placeholder="Enter workspace description"
              className="w-full min-h-[80px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button variant="default">Save Changes</Button>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="space-y-4">
        <div className="font-medium">Usage Statistics</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-semibold">156</div>
            <div className="text-sm text-muted-foreground">Active Products</div>
            <div className="text-xs text-muted-foreground mt-1">
              +12 this month
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-semibold">23</div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
            <div className="text-xs text-muted-foreground mt-1">
              +3 this month
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-semibold">8</div>
            <div className="text-sm text-muted-foreground">Departments</div>
            <div className="text-xs text-muted-foreground mt-1">
              All departments active
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Settings */}
      <div className="space-y-4">
        <div className="font-medium">Workspace Settings</div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">Auto-archive completed projects</div>
              <div className="text-sm text-muted-foreground">
                Automatically archive projects that haven&apos;t been updated in
                90 days.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-primary/20 rounded-full relative">
                <div className="absolute left-5 top-0.5 w-5 h-5 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">
                Require approval for new products
              </div>
              <div className="text-sm text-muted-foreground">
                New products require administrator approval before becoming
                active.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-primary/20 rounded-full relative">
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-muted rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium">Enable audit logging</div>
              <div className="text-sm text-muted-foreground">
                Track all changes and user activities for compliance purposes.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-primary/20 rounded-full relative">
                <div className="absolute left-5 top-0.5 w-5 h-5 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceTab;
