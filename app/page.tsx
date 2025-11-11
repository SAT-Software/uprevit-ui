"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";

export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (!auth.isLoading && auth.isAuthenticated) {
      router.push("/dashboard");
    } else {
      auth.signinRedirect();
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 h-screen">
      <h1 className="text-6xl font-bold text-center">
        AI-Powered Labeling Documentation Platform for Medical Devices
      </h1>
      <p className="w-[60%] text-center">
        Create, manage and track medical device labeling documentation with
        ease. Collaborate seamlessly across teams and effortlessly track your
        departments, projects and products - all in one place.
      </p>
      <div className="flex items-center gap-4">
        <Button variant="default" className="w-fit" onClick={handleGetStarted}>
          {auth.isAuthenticated ? "Go to Dashboard" : "Get Started"}
        </Button>
        {auth.isAuthenticated && (
          <Button onClick={() => auth.removeUser()} variant="destructive">
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
}
