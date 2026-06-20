"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import { useAuth } from "react-oidc-context";
import { PiUserMinusDuotone } from "react-icons/pi";

export function WorkspaceAccessRemovedScreen() {
  const auth = useAuth();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-muted/30 p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border bg-background">
          <PiUserMinusDuotone className="size-6 text-muted-foreground" />
        </div>
        <h1 className="text-lg font-semibold">Workspace access removed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account no longer has access to this workspace. Contact your
          workspace administrator if you believe this is a mistake.
        </p>
        <Button
          variant="outline"
          className="mt-5"
          onClick={() =>
            auth.signoutRedirect({
              post_logout_redirect_uri: window.location.origin,
            })
          }
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
