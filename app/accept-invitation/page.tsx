"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useAcceptInvitation } from "@/queries/invitationsQuery";
import { getAuthToken } from "@/lib/utils";

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [isAccepted, setIsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const hasInitiatedRef = useRef(false);

  const acceptMutation = useAcceptInvitation();

  useEffect(() => {
    // Save the full invitation URL to localStorage when page loads
    if (typeof window !== "undefined" && window.location.href) {
      localStorage.setItem("redirectUrl", window.location.href);
    }
  }, []);

  // Sync isAccepted state with mutation success state
  useEffect(() => {
    if (acceptMutation.isSuccess && !isAccepted) {
      setIsAccepted(true);
      // Clear the saved redirect URL after successful acceptance
      if (typeof window !== "undefined") {
        localStorage.removeItem("redirectUrl");
      }
    }
  }, [acceptMutation.isSuccess, isAccepted]);

  useEffect(() => {
    // Only attempt once when we have a token and user is authenticated
    if (token && !hasInitiatedRef.current && !isAccepted) {
      const access_token = getAuthToken();
      if (access_token) {
        hasInitiatedRef.current = true;
        handleAcceptInvitation();
      } else {
        // User not authenticated - redirect to login
        router.push("/auth/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isAccepted]);

  const handleAcceptInvitation = async () => {
    if (!token) {
      setError("Invalid invitation link. No token provided.");
      setHasAttempted(true);
      return;
    }

    // Prevent multiple simultaneous calls
    if (hasAttempted || acceptMutation.isPending || isAccepted) {
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
      // Clear the saved redirect URL after successful acceptance
      if (typeof window !== "undefined") {
        localStorage.removeItem("redirectUrl");
      }
    } catch (err) {
      // If error is 404, treat as already accepted
      if (err instanceof Error && err.message.includes("404")) {
        setIsAccepted(true);
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
            {acceptMutation.isPending &&
              !isAccepted &&
              !acceptMutation.isSuccess && (
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
            {(isAccepted || acceptMutation.isSuccess) && (
              <>
                <div className="flex justify-center mb-2">
                  <div className="relative">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-green-600">
                  Invitation Accepted!
                </CardTitle>
                <CardDescription className="text-base">
                  You have successfully joined the workspace. Welcome to the
                  team!
                </CardDescription>
              </>
            )}

            {/* Error State */}
            {error && !acceptMutation.isPending && !isAccepted && (
              <>
                <div className="flex justify-center mb-2">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-red-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-red-600">
                  Invitation Failed
                </CardTitle>
                <CardDescription className="text-base">{error}</CardDescription>
              </>
            )}

            {/* No Token State */}
            {!token && !acceptMutation.isPending && (
              <>
                <div className="flex justify-center mb-2">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-orange-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-semibold text-orange-600">
                  Invalid Invitation Link
                </CardTitle>
                <CardDescription className="text-base">
                  This invitation link is invalid or has expired. Please contact
                  the workspace administrator for a new invitation.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Success Actions */}
            {(isAccepted || acceptMutation.isSuccess) && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 text-center">
                    You can now access all workspace features and start
                    collaborating with your team.
                  </p>
                </div>
                <Button
                  onClick={handleGoToDashboard}
                  className="w-full"
                  size="lg"
                  variant="default"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {/* Error Actions */}
            {error && !acceptMutation.isPending && !isAccepted && (
              <>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 text-center">
                    If this problem persists, please contact support or request
                    a new invitation link.
                  </p>
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={handleRetry}
                    className="w-full"
                    size="lg"
                    variant="default"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button
                    onClick={handleGoToLogin}
                    className="w-full"
                    size="lg"
                    variant="outline"
                  >
                    Go to Login
                  </Button>
                </div>
              </>
            )}

            {/* No Token Actions */}
            {!token && !acceptMutation.isPending && (
              <>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-800 text-center">
                    Make sure you clicked the complete invitation link from your
                    email.
                  </p>
                </div>
                <Button
                  onClick={handleGoToLogin}
                  className="w-full"
                  size="lg"
                  variant="default"
                >
                  Go to Login
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact your workspace administrator or{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 underline">
              support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
