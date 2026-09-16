import { Button } from "@/components/ui/button";

export default function MyOrdersError({ onRetry }){
  return (
    <div className="rounded-lg border p-8 text-center">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mt-2 text-sm text-muted-foreground">We couldn't load your orders. Please try again.</p>
      <Button className="mt-4" onClick={onRetry}>Try Again</Button>
    </div>
  );
}