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
      {/* Decorative half circle - positioned behind the card */}
      <div className="p-1 bg-accent border-border border rounded-[13px] max-w-6xl mx-auto">
        <Card className="relative w-full h-150 mx-auto border-border max-w-6xl">
          {/* <div
          className="absolute bottom-0 left-0 w-10 h-20 border border-dashed border-border rounded-l-full border-r-0 z-0"
          style={{
            transform: "translate(-100%, 50%)",
          }}
        /> */}
          <CardHeader>
            <CardContent>
              <p>
                TODO: Add Screenshot of Dashboard page. Or we can add 5 tabs at
                the top, and 5 screenshots and they will be changes for time to
                time.
              </p>
            </CardContent>
          </CardHeader>
          {/* <div
          className="absolute bottom-0 right-0 w-10 h-20 border border-dashed border-border rounded-r-full border-l-0 z-0 rotate-90"
          style={{
            transform: "translate(150%, -25%)",
          }}
        /> */}
        </Card>
      </div>
      <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
    </div>
  );
}
