"use client";

import AuthLogin from "@/components/sections/auth/login";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          Loading...
        </div>
      }
    >
      <AuthLogin />
    </Suspense>
  );
}
