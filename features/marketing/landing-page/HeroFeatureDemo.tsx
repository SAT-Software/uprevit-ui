import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HeroFeatureDemo() {
  return (
    <div className="relative w-full mx-auto mt-20 mb-20">
      <Card className="w-full h-150 mx-auto border-border max-w-7xl">
        <CardHeader>
          <CardContent>
            <p>
              TODO: Add Screenshot of Dashboard page. Or we can add 5 tabs at
              the top, and 5 screenshots and they will be changes for time to
              time.
            </p>
          </CardContent>
        </CardHeader>
      </Card>
      <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
    </div>
  );
}
