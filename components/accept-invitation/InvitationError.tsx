import { AlertCircle, RefreshCw } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InvitationErrorProps {
  error?: string | null;
  hasToken: boolean;
  onRetry: () => void;
  onGoToLogin: () => void;
}

export function InvitationError({
  error,
  hasToken,
  onRetry,
  onGoToLogin,
}: InvitationErrorProps) {
  // Error State (when there's an error message)
  if (error) {
    return (
      <>
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-red-600">
            Invitation Failed
          </CardTitle>
          <CardDescription className="text-base">{error}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 text-center">
              If this problem persists, please contact support or request a new
              invitation link.
            </p>
          </div>
          <div className="space-y-2">
            <Button
              onClick={onRetry}
              className="w-full"
              size="lg"
              variant="default"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={onGoToLogin}
              className="w-full"
              size="lg"
              variant="outline"
            >
              Go to Login
            </Button>
          </div>
        </CardContent>
      </>
    );
  }

  // No Token State (when there's no token)
  if (!hasToken) {
    return (
      <>
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-orange-600">
            Invalid Invitation Link
          </CardTitle>
          <CardDescription className="text-base">
            This invitation link is invalid or has expired. Please contact the
            workspace administrator for a new invitation.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800 text-center">
              Make sure you clicked the complete invitation link from your
              email.
            </p>
          </div>
          <Button
            onClick={onGoToLogin}
            className="w-full"
            size="lg"
            variant="default"
          >
            Go to Login
          </Button>
        </CardContent>
      </>
    );
  }

  return null;
}
