"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export function LoginButton() {
  const { signinRedirect, isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();

  const handleLogin = async () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      try {
        await signinRedirect();
      } catch (error) {
        console.error("Login error:", error);
      }
    }
  };

  return (
    <Button 
      variant="default" 
      className="w-fit mt-4"
      onClick={handleLogin}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : isAuthenticated ? "Go to Dashboard" : "Get Started"}
    </Button>
  );
} 