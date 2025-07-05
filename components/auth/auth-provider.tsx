"use client";

import { AuthProvider as OidcAuthProvider } from "react-oidc-context";
import { cognitoAuthConfig } from "@/lib/auth-config";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <OidcAuthProvider {...cognitoAuthConfig}>
      {children}
    </OidcAuthProvider>
  );
} 