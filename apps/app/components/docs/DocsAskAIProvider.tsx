"use client";

import { GlossenProvider } from "@/components/glossen";
import { useAuth } from "react-oidc-context";

export function DocsAskAIProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const accessToken = auth.user?.access_token;
  const userId = auth.user?.profile.sub;

  return (
    <GlossenProvider
      storageKey={`glossen:${userId ?? "signed-out"}`}
      headers={(): Record<string, string> =>
        accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      }
      welcome={{
        title: "Ask AI",
        description:
          "Ask anything about the Uprevit documentation. Answers link to the pages they come from. Ask AI only reads the documentation, never your workspace data.",
      }}
      suggestions={[
        "How do I create a product?",
        "How do approval workflows work?",
        "How do I export a product?",
      ]}
    >
      {children}
    </GlossenProvider>
  );
}
