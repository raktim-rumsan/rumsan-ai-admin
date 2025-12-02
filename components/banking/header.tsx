"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                R
              </span>
            </div>
            <span className="font-semibold text-lg">Rumsan Chatty</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#solutions"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Solutions
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </a>
          </div>

          <div className="hidden md:block">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Request Demo
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#home"
              className="block text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="block text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#solutions"
              className="block text-sm font-medium hover:text-primary transition-colors"
            >
              Solutions
            </a>
            <a
              href="#pricing"
              className="block text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="block text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </a>
            <Button
              size="sm"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Request Demo
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
