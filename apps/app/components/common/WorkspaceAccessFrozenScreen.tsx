"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import { useAuth } from "react-oidc-context";
import { PiSnowflakeDuotone } from "react-icons/pi";

export function WorkspaceAccessFrozenScreen() {
  const auth = useAuth();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-xl border border-amber-200 bg-amber-50/80 p-6 text-center shadow-sm dark:border-amber-900/50 dark:bg-amber-950/30">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
          <PiSnowflakeDuotone className="size-6" />
        </div>
        <h1 className="text-lg font-semibold text-amber-950 dark:text-amber-100">
          Workspace access is frozen
        </h1>
        <p className="mt-2 text-sm text-amber-900/80 dark:text-amber-200/80">
          A platform operator has suspended access to this workspace. You cannot
          use the app until access is restored. Contact your administrator or
          Uprevit support if you need help.
        </p>
        <Button
          variant="outline"
          className="mt-5 border-amber-300 bg-background/80 dark:border-amber-800"
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
