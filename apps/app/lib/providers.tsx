"use client";

import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import * as React from "react";
import { AuthProvider } from "react-oidc-context";
import { shouldRetryQuery } from "@/lib/api-error";

const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () =>
          import("@tanstack/react-query-devtools").then(
            (mod) => mod.ReactQueryDevtools,
          ),
        { ssr: false },
      )
    : null;

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_REDIRECT_URI!;

const cognitoAuthConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY!,
  client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
  redirect_uri: `${appUrl}/auth/callback`,
  response_type: "code",
  scope: "email openid phone",
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: shouldRetryQuery,
        retryDelay: 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <AuthProvider {...cognitoAuthConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        {ReactQueryDevtools ? <ReactQueryDevtools /> : null}
      </QueryClientProvider>
    </AuthProvider>
  );
}
