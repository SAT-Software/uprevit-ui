"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@uprevit/ui/components/ui/dialog";
import {
  PiShieldCheckDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

export function PlatformOperatorSetupDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <PiShieldCheckDuotone className="h-4 w-4" />
          Add platform operator
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="flex w-full items-center justify-between border-b bg-accent px-4 py-4 text-sm">
            <div className="flex items-center gap-2">
              <PiShieldCheckDuotone className="h-5 w-5 text-muted-foreground" />
              <p>Add platform operator</p>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
          <div className="border-b bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            Phase 1 uses manual setup (no in-app invite yet). Follow these steps
            for a co-founder or teammate who should access the platform admin
            portal.
          </div>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Manual steps to add a platform operator via Cognito and the backend
          bootstrap script.
        </DialogDescription>

        <div className="flex-1 overflow-y-auto p-4">
          <ol className="list-decimal space-y-3 pl-5 text-sm text-muted-foreground">
            <li>
              In AWS Cognito, add their user to the{" "}
              <span className="font-mono text-foreground">platform-admin</span>{" "}
              group.
            </li>
            <li>
              Copy their Cognito{" "}
              <span className="font-mono text-foreground">sub</span> from the
              user pool user details.
            </li>
            <li>
              From the backend repo{" "}
              <span className="font-mono text-foreground">src/</span>, with{" "}
              <span className="font-mono text-foreground">MONGODB_URI</span> and{" "}
              <span className="font-mono text-foreground">DB_NAME</span> set,
              run:
              <pre className="mt-2 overflow-x-auto rounded-md border bg-muted p-3 text-xs text-foreground">
                {`npm run bootstrap:platform-admin -- \\
  --email colleague@company.com \\
  --cognito-sub <cognito-sub> \\
  --name "Colleague Name" \\
  --role operator`}
              </pre>
            </li>
            <li>
              They must also have an{" "}
              <strong className="text-foreground">active</strong> workspace user
              record (dual-hat operator) to use platform admin in Phase 1.
            </li>
          </ol>
        </div>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              <PiXCircleDuotone />
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
