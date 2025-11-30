import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DemoSection() {
  return (
    <div className="max-w-6xl w-full mx-auto mt-40 mb-20">
      <Card className="w-full h-180">
        <CardHeader>
          <CardTitle>Demo</CardTitle>
          <CardDescription>Watch a demo of our product</CardDescription>
          <CardContent>
            <p>Watch a demo of our product</p>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
