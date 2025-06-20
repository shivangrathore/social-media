import { Skeleton } from "@/components/ui/skeleton";

export function PollLoadingSkeleton() {
  return (
    <div className="p-4">
      <div className="mb-4">
        <Skeleton className="h-14 w-full" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, idx) => (
          <Skeleton key={idx} className="h-10 w-full" />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
      <div className="mt-4">
        <Skeleton className="h-10 w-24 ml-auto" />
      </div>
    </div>
  );
}
