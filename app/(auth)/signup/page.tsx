import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";

function SignupPage() {
  //   return (
  //     <div className="flex justify-between w-full h-screen gap-12 py-8 px-8">
  //       {/* Content and Input */}
  //       <div className="flex flex-col gap-8 justify-center w-full h-full text-center items-center ">
  //         <div className="flex flex-col gap-1 justify-center">
  //           <h1 className="text-2xl font-bold">
  //             Welcome to SAT Sign Up to getting started
  //           </h1>
  //           <p>Enter your detail to procced further</p>
  //         </div>
  //         <form className="flex flex-col gap-6 items-start w-[60%]">
  //           <div className="flex flex-col gap-1 items-start w-full">
  //             <Label htmlFor="email">Email</Label>
  //             <Input type="email" placeholder="Email" />
  //           </div>
  //           <div className="flex gap-2">
  //             <Button variant="outline" className="w-full">
  //               back
  //             </Button>
  //             <Button type="submit" className="w-full">
  //               Sign Up
  //             </Button>
  //           </div>
  //         </form>
  //       </div>

  //       {/* Side content */}
  //       <div className="flex gap-4 h-full w-full ">
  //         <div className="flex flex-col gap-4 h-full w-full ">
  //           <div className="bg-emerald-950 h-full rounded-2xl">
  //             <h2>Handle all Labeling Documentation</h2>
  //           </div>
  //           <div className="bg-emerald-400 h-full rounded-2xl">
  //             <p>Write, Review, Submit, Launch</p>
  //           </div>
  //         </div>
  //         <div className="bg-primary w-full rounded-2xl">
  //           <p>Streamline Your Workflow</p>
  //         </div>
  //       </div>
  //     </div>
  //   );

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-bold">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            UPREVIT
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form className={cn("flex flex-col gap-6")}>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  Welcome to Uprevit <br />
                  Sign Up to getting started
                </h1>
                <p className="text-balance text-sm text-muted-foreground">
                  Enter your email to procced further
                </p>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Sign up
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Log in
                </a>
              </div>
              <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/department.jpg"
          alt="Image"
          fill
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

export default SignupPage;
