import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CTASection() {
  return (
    <div className="w-full mt-40 mb-20">
      <div className="relative w-full">
        <div className="p-1 bg-accent rounded-xl max-w-7xl mx-auto border border-border">
          <Card className="w-full h-150 mx-auto border-border max-w-7xl bg-foreground text-background">
            <CardHeader>
              <CardTitle>Report</CardTitle>
              <CardDescription>Generate powerful reports</CardDescription>
              <CardContent>
                <p>Generate powerful reports</p>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
        <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
      </div>
    </div>
  );
}
