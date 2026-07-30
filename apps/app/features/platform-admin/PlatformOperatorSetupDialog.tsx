"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import {
  Cancel01Icon,
  UserSettings01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";

export function PlatformOperatorSetupDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <Icon icon={UserSettings01Icon} size={14} strokeWidth={2} />
          Add Platform Admin
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Add platform operator"
        description="Manual steps to add a platform operator via Cognito and the backend bootstrap script."
        subtitle="Phase 1 requires a one-time manual setup. Use the steps below to grant a teammate or co-founder access to the platform admin area."
        variant="inform"
        size="lg"
        secondaryAction={{
          label: "Close",
          icon: Cancel01Icon,
        }}
      >
        <ol className="list-decimal space-y-3 p-4 pl-9 text-sm text-muted-foreground">
          <li>
            In AWS Cognito, add their user to the{" "}
            <span className="font-mono text-foreground">platform-admin</span>{" "}
            group.
          </li>
          <li>
            Copy their Cognito{" "}
            <span className="font-mono text-foreground">sub</span> from the user
            pool user details.
          </li>
          <li>
            From the backend repo{" "}
            <span className="font-mono text-foreground">src/</span>, with{" "}
            <span className="font-mono text-foreground">MONGODB_URI</span> and{" "}
            <span className="font-mono text-foreground">DB_NAME</span> set, run:
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
      </AppDialogContent>
    </Dialog>
  );
}
