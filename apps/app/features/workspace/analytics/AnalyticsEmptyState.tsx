export function AnalyticsEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-72 items-center justify-center p-6 text-sm text-muted-foreground">
      {message}
    </div>
  );
}
