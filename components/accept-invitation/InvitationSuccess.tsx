import { CheckCircle2, ArrowRight } from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InvitationSuccessProps {
  onGoToDashboard: () => void;
}

export function InvitationSuccess({ onGoToDashboard }: InvitationSuccessProps) {
  return (
    <>
      <CardHeader className="text-center space-y-4">
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
          You have successfully joined the workspace. Welcome to the team!
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800 text-center">
            You can now access all workspace features and start collaborating
            with your team.
          </p>
        </div>
        <Button
          onClick={onGoToDashboard}
          className="w-full"
          size="lg"
          variant="default"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </>
  );
}
