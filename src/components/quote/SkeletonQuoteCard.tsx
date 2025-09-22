import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonQuoteCard() {
  return (
    <Card className="relative w-full mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-6 right-6 z-10">
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>

      <CardContent className="relative p-12">
        <div className="relative flex flex-col text-center mb-8">
          <div className="space-y-3 mb-8 px-8">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>

          <div className="flex items-center justify-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>

        <div className="absolute bottom-6 right-6">
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}
