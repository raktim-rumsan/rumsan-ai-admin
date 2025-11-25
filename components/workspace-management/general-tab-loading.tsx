"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "lucide-react";

export default function GeneralTabSkeleton() {
return ( 
    <>
<div className="space-y-6">
{/* General Workspace Card Skeleton */} <div className="rounded-xl border p-6 shadow-sm space-y-6">
{/* Header */} <div> <Skeleton className="h-7 w-48 mb-1" /> {/* General Workspace Settings */} <Skeleton className="h-4 w-80" /> {/* Subtitle */} </div>

    {/* Workspace Name */}
    <div className="space-y-2">
      <Skeleton className="h-5 w-36" /> {/* Label */}
      <Skeleton className="h-12 w-full rounded-md" /> {/* Input */}
    </div>

    {/* Bot Name */}
    <div className="space-y-2">
      <Skeleton className="h-5 w-28" /> {/* Label */}
      <Skeleton className="h-12 w-full rounded-md" /> {/* Input */}
    </div>

    {/* Workspace Sector */}
    <div className="space-y-2">
      <Skeleton className="h-5 w-32" /> {/* Label */}
      <Skeleton className="h-12 w-full rounded-md" /> {/* Select */}
    </div>

    {/* Workspace Description */}
    <div className="space-y-2">
      <Skeleton className="h-5 w-44" /> {/* Label */}
      <Skeleton className="h-24 w-full rounded-md" /> {/* Textarea */}
    </div>

    {/* Save Button */}
    <div className="flex gap-4 pt-4">
      <Skeleton className="h-12 w-40 rounded-md" />
    </div>
  </div>
</div>
</>

);
}
