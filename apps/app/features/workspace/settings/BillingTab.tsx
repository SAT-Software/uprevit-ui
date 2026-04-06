"use client";

import React from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import { Input } from "@uprevit/ui/components/ui/input";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Separator } from "@uprevit/ui/components/ui/separator";

function BillingTab() {
  return (
    <div className="space-y-6">
      {/* Current Plan Header */}
      <div className="flex items-center gap-6 p-6 bg-accent rounded-lg border">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-semibold">Enterprise Plan</h2>
            <Badge variant="default">Active</Badge>
          </div>
          <p className="text-muted-foreground">
            Manage your subscription and billing information.
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold">$299</div>
          <div className="text-sm text-muted-foreground">per month</div>
        </div>
      </div>

      {/* Plan Details */}
      <div className="space-y-4">
        <div className="font-medium">Plan Details</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Plan Name</label>
            <Input
              type="text"
              value="Enterprise Plan"
              placeholder="Plan name"
              className="w-full"
              disabled
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Plan Start Date</label>
            <Input
              type="text"
              value="January 15, 2024"
              placeholder="Plan start date"
              className="w-full"
              disabled
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Billing Cycle</label>
            <Input
              type="text"
              value="Annual ($3,588/year)"
              placeholder="Billing cycle"
              className="w-full"
              disabled
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Next Billing Date</label>
            <Input
              type="text"
              value="January 15, 2025"
              placeholder="Next billing date"
              className="w-full"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Seats & Usage */}
      <div className="space-y-4">
        <div className="font-medium">Seats & Usage</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Total Seats</div>
              <Badge variant="outline">50 of 50 used</Badge>
            </div>
            <div className="text-2xl font-semibold">50</div>
            <div className="text-sm text-muted-foreground">
              All seats are currently allocated
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Admin Seats</div>
              <Badge variant="default">5 of 5 used</Badge>
            </div>
            <div className="text-2xl font-semibold">5</div>
            <div className="text-sm text-muted-foreground">
              Administrator privileges
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">User Seats</div>
              <Badge variant="secondary">42 of 45 used</Badge>
            </div>
            <div className="text-2xl font-semibold">42</div>
            <div className="text-sm text-muted-foreground">
              Standard user access
            </div>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Available Seats</div>
              <Badge variant="outline">3 remaining</Badge>
            </div>
            <div className="text-2xl font-semibold">3</div>
            <div className="text-sm text-muted-foreground">
              Ready for new users
            </div>
          </div>
        </div>
      </div>

      {/* Plan Features */}
      <div className="space-y-4">
        <div className="font-medium">Plan Features</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Unlimited products and projects</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Advanced compliance tools</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Priority customer support</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Custom integrations</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Advanced reports & reporting</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">SSO and advanced security</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">API access and webhooks</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Dedicated account manager</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Billing Information */}
      <div className="space-y-4">
        <div className="font-medium">Billing Information</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input
              type="text"
              value="MedTech Solutions Inc."
              placeholder="Company name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tax ID / VAT Number</label>
            <Input
              type="text"
              value="TAX-123456789"
              placeholder="Tax ID or VAT number"
              className="w-full"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Billing Address</label>
            <Input
              type="text"
              value="123 Medical Device Blvd, Suite 400"
              placeholder="Street address"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input
              type="text"
              value="San Francisco"
              placeholder="City"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">State/Province</label>
            <Input
              type="text"
              value="CA"
              placeholder="State or province"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ZIP/Postal Code</label>
            <Input
              type="text"
              value="94105"
              placeholder="ZIP or postal code"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Input
              type="text"
              value="United States"
              placeholder="Country"
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button variant="default">Update Billing Info</Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <div className="font-medium">Billing Actions</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div className="text-center">
              <div className="font-medium">View Invoices</div>
              <div className="text-xs text-muted-foreground">
                Access billing history
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div className="text-center">
              <div className="font-medium">Customer Portal</div>
              <div className="text-xs text-muted-foreground">
                Manage subscription
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div className="text-center">
              <div className="font-medium">Download Invoice</div>
              <div className="text-xs text-muted-foreground">
                Get latest invoice
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <div className="font-medium">Payment Method</div>

        <div className="p-4 border border-border rounded-lg bg-accent/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <div className="font-medium">•••• •••• •••• 4242</div>
                <div className="text-sm text-muted-foreground">
                  Expires 12/26
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingTab;
