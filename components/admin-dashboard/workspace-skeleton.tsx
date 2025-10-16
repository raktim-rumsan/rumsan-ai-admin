import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-4 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

export function CreateWorkspaceSkeleton() {
  return (
    <Card className="mt-6 border-dashed">
      <CardHeader className="text-center py-12">
        <div className="mx-auto mb-4 rounded-full bg-muted p-4 w-fit">
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <Skeleton className="h-6 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-96 mx-auto mt-2" />
        <Skeleton className="h-10 w-40 mx-auto mt-4 rounded-md" />
      </CardHeader>
    </Card>
  );
}

export function WorkspacesLoadingGrid() {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <WorkspaceSkeleton key={i} />
        ))}
      </div>
      <CreateWorkspaceSkeleton />
    </>
  );
}
