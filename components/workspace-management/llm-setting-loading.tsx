"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function LLMConfigurationSkeleton() {
  return (
    <div className="space-y-6 rounded-xl border p-6 shadow-sm">
      {/* Header */}
      <div>
        <Skeleton className="h-7 w-48 mb-1" /> {/* LLM Configuration */}
        <Skeleton className="h-4 w-80" /> {/* Subtitle */}
      </div>

      {/* AI Provider Section */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-28" /> {/* AI Provider Label */}
        <Skeleton className="h-10 w-full rounded-md" /> {/* Dropdown */}
        <Skeleton className="h-3 w-60" /> {/* Description */}
      </div>

      {/* Model Selection */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-36" /> {/* Model Selection Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Chat Model Label */}
            <Skeleton className="h-10 w-full rounded-md" />{" "}
            {/* Chat Model Select */}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />{" "}
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="pt-2 space-y-4">
        <Skeleton className="h-5 w-44" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />{" "}
            {/* Temperature Input */}
            <Skeleton className="h-3 w-44" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-md" />{" "}
            {/* Max Tokens Input */}
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-10 w-40 rounded-md" />
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>
    </div>
  );
}
