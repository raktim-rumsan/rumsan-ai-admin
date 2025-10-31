"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Mail,
} from "lucide-react";
import {
  useResendVerificationEmailMutation,
  useVerifyEmailMutation,
} from "@/queries/loginQuery";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const verifyEmailMutation = useVerifyEmailMutation();
  const resendVerificationEmailMutation = useResendVerificationEmailMutation();

  useEffect(() => {
    const verifyEmail = async () => {
      const tokenHash = searchParams.get("token_hash");

      if (!tokenHash) {
        setStatus("error");
        setErrorMessage("Verification token is missing");
        return;
      }
      verifyEmailMutation.mutate(
        { tokenHash },
        {
          onSuccess: () => {
            setStatus("success");
          },
          onError: (error: any) => {
            setStatus("error");
            setErrorMessage(
              error?.message || "Verification failed. Please try again."
            );
          },
        }
      );
    };

    verifyEmail();
  }, [searchParams]);

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendSuccess(false);
    const email = searchParams.get("email");
    try {
      await resendVerificationEmailMutation.mutateAsync(email!);
      setResendSuccess(true);
    } catch (error) {
      setErrorMessage("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 flex flex-col items-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-white"
              fill="currentColor"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Rumsan AI</h1>
      </div>

      <Card className="w-full max-w-md">
        {status === "loading" && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl">Verifying Your Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Please wait while we verify your email...
              </p>
            </CardContent>
          </>
        )}

        {status === "success" && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">
                Email Verified Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Your email has been verified. You can now access the dashboard.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center font-medium text-blue-600 hover:underline"
              >
                Enter Dashboard
                <ArrowRight className="w-4 h-4 ms-2" />
              </Link>
            </CardContent>
          </>
        )}

        {status === "error" && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
              <CardTitle className="text-2xl">Verification Failed</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-red-600 text-sm">{errorMessage}</p>

              {resendSuccess ? (
                <p className="text-green-600 text-sm">
                  Verification email sent! Check your inbox.
                </p>
              ) : (
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
