"use client";

import { useAuth } from "react-oidc-context";

export function useAuthContext() {
  const auth = useAuth();
  
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    signinRedirect: auth.signinRedirect,
    signoutRedirect: auth.signoutRedirect,
    removeUser: auth.removeUser,
    signinSilent: auth.signinSilent,
    signinPopup: auth.signinPopup,
    signoutPopup: auth.signoutPopup,
    signinResourceOwnerCredentials: auth.signinResourceOwnerCredentials,
    clearStaleState: auth.clearStaleState,
  };
} 