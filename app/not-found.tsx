"use client";

import Image from "next/image";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-muted/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-muted/20 rounded-full blur-3xl" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="notFoundGrid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#notFoundGrid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          {/* Robot Image */}
          <div className="flex justify-center">
            <Image
              src="https://assets.rumsan.net/rumsan-group/robot-404.png"
              alt="404 Robot"
              width={180}
              height={80}
              unoptimized
            />
          </div>

          {/* 404 Number with gradient */}
          <div className="mb-8">
            <h1 className="text-xl md:text-[6rem] font-bold leading-none mb-4 text-foreground">
              404
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <AlertCircle className="w-6 h-6 text-muted-foreground" />
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                Page Not Found
              </h2>
            </div>
          </div>

          {/* Error message */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
            Oops! The page you&apos;re looking for seems to have wandered off
            into the digital void. Don&apos;t worry, even the best AI assistants
            occasionally lose their way.
          </p>

          {/* Action button */}
          <div className="flex items-center justify-center mb-12">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="cursor-pointer underline underline-offset-4 hover:bg-transparent hover:text-current"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-muted/20 rounded-full blur-xl" />
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-muted/20 rounded-full blur-xl" />
          <div className="absolute top-1/2 right-20 w-12 h-12 bg-muted/20 rounded-full blur-lg" />
        </div>
      </div>
    </div>
  );
}
