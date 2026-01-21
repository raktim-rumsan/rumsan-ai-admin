"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";

type ScrollableTab = {
  name: string;
  value: string;
  icons: React.ComponentType<{ className?: string }>;
};

type ScrollableTabsProps = {
  tabs: ScrollableTab[];
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  scrollStep?: number;
  showArrows?: boolean;
};

export function ScrollableTabs({
  tabs,
  className,
  listClassName,
  triggerClassName,
  scrollStep = 200,
  showArrows = true,
}: ScrollableTabsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { canScrollLeft, canScrollRight, hasOverflow, scrollLeft, scrollRight } =
    useHorizontalScroll(containerRef, { step: scrollStep });

  return (
    <div className={cn("flex items-center gap-2 min-w-0 w-full", className)}>
      {showArrows && hasOverflow && (
        <Button
          variant="outline"
          size="sm"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className="shrink-0"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <div
        ref={containerRef}
        className={cn(
          "flex-1 min-w-0",
          hasOverflow ? "overflow-x-auto thin-scrollbar" : "overflow-x-hidden"
        )}
      >
        <TabsList className={cn("inline-flex space-x-4 w-max", listClassName)}>
          {tabs.map((tab) => (
            <TabsTrigger
              value={tab.value}
              key={tab.value}
              className={cn("whitespace-nowrap", triggerClassName)}
            >
              <tab.icons className="h-4 w-4 mr-2" /> {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {showArrows && hasOverflow && (
        <Button
          variant="outline"
          size="sm"
          onClick={scrollRight}
          disabled={!canScrollRight}
          className="shrink-0"
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

