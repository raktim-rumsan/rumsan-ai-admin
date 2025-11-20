"use client";

import { useEffect, useState, useRef, Suspense } from "react";
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

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [isAccepted, setIsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setHasAttempted] = useState(false);
  const hasInitiatedRef = useRef(false);
  const organizationData = useOrganizationContext();

  const acceptMutation = useAcceptInvitation();

  useEffect(() => {
    if (hasInitiatedRef.current) {
      return;
    }

    const access_token = getAuthToken();

    if (!access_token) {
      // User not logged in - middleware will redirect to login with redirectUrl param
      hasInitiatedRef.current = true;
      router.push("/auth/login");
      return;
    }

    // User is logged in - proceed with invitation acceptance
    if (organizationData && token) {
      hasInitiatedRef.current = true;
      handleAcceptInvitation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationData, token]);

  const handleAcceptInvitation = async () => {
    if (!token) {
      setError("Invalid invitation link. No token provided.");
      setHasAttempted(true);
      return;
    }

    // Check if user is authenticated
    const access_token = getAuthToken();
    if (!access_token) {
      router.push("/auth/login");
      return;
    }

    setHasAttempted(true);
    setError(null);

    try {
      await acceptMutation.mutateAsync(token);
      setIsAccepted(true);
      if (organizationData.refetch) {
        await organizationData.refetch();
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("redirectUrl");
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("404")) {
        setIsAccepted(true);
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
    if (typeof window !== "undefined") {
      localStorage.removeItem("redirectUrl");
    }
    router.push("/dashboard");
  };

  const handleGoToLogin = () => {
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

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
