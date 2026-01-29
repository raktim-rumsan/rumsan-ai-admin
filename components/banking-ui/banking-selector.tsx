"use client";

import { BankConfig, banks } from "@/lib/customize-bank-data";
import { cn } from "@/lib/utils";
import { Building2, ChevronRight } from "lucide-react";

interface BankSelectorProps {
  onSelectBank: (bank: BankConfig) => void;
  selectedBankId?: string;
}

export function BankSelector({
  onSelectBank,
  selectedBankId,
}: BankSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Select a Bank to Demo
        </h2>
        <p className="text-muted-foreground">
          Choose a bank to preview and customize the AI assistant experience
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {banks.map((bank) => (
          <button
            key={bank.id}
            onClick={() => onSelectBank(bank)}
            className={cn(
              "group relative flex items-center gap-4 p-5 rounded-lg border bg-card text-left transition-all duration-200",
              "hover:border-primary/50 hover:shadow-md hover:bg-secondary/30",
              selectedBankId === bank.id &&
                "border-primary bg-secondary/50 shadow-md"
            )}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${bank.primaryColor}15` }}
            >
              <Building2
                className="h-6 w-6"
                style={{ color: bank.primaryColor }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">
                {bank.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {bank.tagline}
              </p>
            </div>

            <ChevronRight
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform",
                "group-hover:translate-x-1 group-hover:text-primary"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
