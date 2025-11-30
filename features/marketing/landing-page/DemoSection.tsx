import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DemoSection() {
  return (
    <div className="relative w-full mx-auto mt-20 mb-20">
      <Card className="w-full h-150 max-w-4xl mx-auto border-accent">
        <CardHeader>
          <CardTitle>Demo</CardTitle>
          <CardDescription>Watch a demo of our product</CardDescription>
          <CardContent>
            <p>Watch a demo of our product</p>
          </CardContent>
        </CardHeader>
      </Card>
      <div className="absolute top-0 left-0 w-full h-px bg-accent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-accent" />
    </div>
  );
}
