"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Users } from "lucide-react";
import { useAcceptInvitation } from "@/queries/invitationsQuery";
import { getAuthToken } from "@/lib/utils";
import { InvitationSuccess } from "@/components/accept-invitation/InvitationSuccess";
import { InvitationError } from "@/components/accept-invitation/InvitationError";
import { useOrganizationContext } from "@/hooks/useOrganizationContext";

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [isAccepted, setIsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const hasInitiatedRef = useRef(false);
  const organizationData = useOrganizationContext();

  const acceptMutation = useAcceptInvitation();

  useEffect(() => {
    // Prevent duplicate calls (React Strict Mode runs effects twice in development)
    if (hasInitiatedRef.current) {
      return;
    }

    // Save the full invitation URL to localStorage when page loads
    if (typeof window !== "undefined" && window.location.href) {
      localStorage.setItem("redirectUrl", window.location.href);
    }

    // Only attempt once when we have a token and user is authenticated
    if (organizationData && token) {
      hasInitiatedRef.current = true;
      handleAcceptInvitation();
    } else if (!organizationData) {
      // User not authenticated - redirect to login (only once)
      hasInitiatedRef.current = true;
      router.push("/auth/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcceptInvitation = async () => {
    if (!token) {
      setError("Invalid invitation link. No token provided.");
      setHasAttempted(true);
      return;
    }

    // Check if user is authenticated
    const access_token = getAuthToken();
    if (!access_token) {
      // User not authenticated - redirect to login
      // URL is already saved in localStorage from useEffect
      router.push("/auth/login");
      return;
    }

    setHasAttempted(true);
    setError(null);

    try {
      await acceptMutation.mutateAsync(token);
      // If mutation succeeds without throwing, set accepted state
      setIsAccepted(true);

      // Refetch organization context to update workspace list
      if (organizationData.refetch) {
        await organizationData.refetch();
      }

      // Clear the saved redirect URL after successful acceptance
      if (typeof window !== "undefined") {
        localStorage.removeItem("redirectUrl");
      }
    } catch (err) {
      // If error is 404, treat as already accepted
      if (err instanceof Error && err.message.includes("404")) {
        setIsAccepted(true);

        // Refetch organization context even if already accepted
        if (organizationData.refetch) {
          await organizationData.refetch();
        }

        if (typeof window !== "undefined") {
          localStorage.removeItem("redirectUrl");
        }
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to accept invitation. Please try again."
        );
        // Reset hasAttempted on error so user can retry
        setHasAttempted(false);
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    setHasAttempted(false);
    hasInitiatedRef.current = false;
    handleAcceptInvitation();
  };

  const handleGoToDashboard = () => {
    // Clear redirect URL before going to dashboard
    if (typeof window !== "undefined") {
      localStorage.removeItem("redirectUrl");
    }
    router.push("/dashboard");
  };

  const handleGoToLogin = () => {
    // URL is already saved in localStorage from useEffect
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center shadow-lg">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-white"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Rumsan AI</h1>
          <p className="text-sm text-gray-500 mt-1">Workspace Invitation</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center space-y-4">
            {/* Loading State */}
            {acceptMutation.isPending && !isAccepted && (
              <>
                <div className="flex justify-center mb-2">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                    <Users className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold">
                  Accepting Invitation
                </CardTitle>
                <CardDescription className="text-base">
                  Please wait while we process your workspace invitation...
                </CardDescription>
                <div className="flex justify-center pt-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </>
            )}

            {/* Success State */}
            {isAccepted && (
              <InvitationSuccess onGoToDashboard={handleGoToDashboard} />
            )}

            {/* Error or No Token State */}
            {((error && !acceptMutation.isPending && !isAccepted) ||
              (!token && !acceptMutation.isPending)) && (
              <InvitationError
                error={error}
                hasToken={!!token}
                onRetry={handleRetry}
                onGoToLogin={handleGoToLogin}
              />
            )}
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
