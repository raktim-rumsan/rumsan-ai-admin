"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  isLoading: boolean;
}

export function QuickQuestions({
  questions,
  onQuestionClick,
  isLoading,
}: QuickQuestionsProps) {
  return (
    <div className="px-3 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4 bg-muted/30 border-t border-border">
      {/* Mobile: Accordion */}
      <div className="lg:hidden">
        <AccordionPrimitive.Root
          type="single"
          collapsible
          defaultValue="quick-questions"
        >
          <AccordionPrimitive.Item value="quick-questions" className="border-0">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger
                className={cn(
                  "flex flex-1 items-center justify-between py-0 font-medium transition-all hover:opacity-80 [&[data-state=open]>svg]:rotate-180"
                )}
              >
                <p className="text-[11px] sm:text-xs md:text-sm font-medium text-muted-foreground">
                  Quick Questions:
                </p>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground" />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="pt-2 sm:pt-2.5 md:pt-3">
                <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3">
                  {questions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => onQuestionClick(question)}
                      disabled={isLoading}
                      className="w-full text-left text-[12px] sm:text-sm md:text-base px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3.5 rounded-[50px] bg-background border border-border hover:border-primary hover:bg-primary/5 active:bg-primary/10 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] sm:min-h-[48px] md:min-h-[52px]"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        </AccordionPrimitive.Root>
      </div>

      {/* Desktop: Always visible */}
      <div className="hidden lg:block">
        <p className="text-sm font-medium text-muted-foreground mb-3">
          Quick Questions:
        </p>
        <div className="flex flex-row gap-2 overflow-x-auto overflow-y-hidden pb-1 -mx-6 px-6 scrollbar-hide">
          {questions.map((question, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(question)}
              disabled={isLoading}
              className="shrink-0 text-center text-xs px-4 py-2 rounded-full bg-background border border-border hover:border-primary hover:bg-primary/5 active:bg-primary/10 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[32px] whitespace-nowrap"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
