"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { signoutRedirect, isLoading } = useAuthContext();

  const handleLogout = async () => {
    try {
      await signoutRedirect();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? "Signing out..." : "Sign Out"}
    </Button>
  );
} 