import { Skeleton } from "@/components/ui/skeleton";

export function ComposePostLoadingSkeleton() {
  return (
    <div>
      <Skeleton className="h-14 w-full mb-4" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Array.from({ length: 2 }).map((_, idx) => (
            <Skeleton key={idx} className="size-8 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-8 w-14 rounded-md" />
      </div>
    </div>
  );
}
