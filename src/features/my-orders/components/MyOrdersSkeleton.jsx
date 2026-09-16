import { Card, CardContent } from "@/components/ui/card";

export default function MyOrdersSkeleton(){
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <Card key={item}>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-5 w-24 rounded bg-muted" />
              <div className="h-6 w-20 rounded bg-muted" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 