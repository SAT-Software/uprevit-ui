"use client";

import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

interface SignInButtonProps {
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  clearError?: boolean;
}

export function SignInButton({ 
  children = "Sign In", 
  variant = "default", 
  size = "default",
  className,
  clearError = false
}: SignInButtonProps) {
  const auth = useAuth();

  const handleSignIn = () => {
    if (clearError || auth.error) {
      // Clear the error state first
      auth.clearStaleState();
			auth.error = undefined;
    }
    auth.signinRedirect();
  };

  return (
    <Button 
      onClick={handleSignIn} 
      variant={variant} 
      size={size}
      className={className}
      disabled={auth.isLoading}
    >
      <LogIn className="w-4 h-4 mr-2" />
      {children}
    </Button>
  );
}

interface SignOutButtonProps {
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  customLogout?: boolean;
}

export function SignOutButton({ 
  children = "Sign Out", 
  variant = "outline", 
  size = "default",
  className,
  customLogout = false
}: SignOutButtonProps) {
  const auth = useAuth();

  const handleSignOut = () => {
    if (customLogout) {
      // Custom Cognito logout with redirect
      const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
      const logoutUri = `${window.location.origin}/`;
      const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    } else {
      // Standard OIDC logout
      auth.removeUser();
    }
  };

  return (
    <Button 
      onClick={handleSignOut} 
      variant={variant} 
      size={size}
      className={className}
      disabled={auth.isLoading}
    >
      <LogOut className="w-4 h-4 mr-2" />
      {children}
    </Button>
  );
}