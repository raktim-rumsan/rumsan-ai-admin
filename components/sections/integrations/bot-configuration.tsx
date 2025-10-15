import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Eye, EyeOff, Info } from "lucide-react";
import { useState } from "react";

export default function BotConfiguration() {
  const [showBotToken, setShowBotToken] = useState(false);
  const [showSigningSecret, setShowSigningSecret] = useState(false);
  const [botToken, setBotToken] = useState("");
  const [signingSecret, setSigningSecret] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            2
          </div>
          Project Setup
        </CardTitle>
        <CardDescription>
          Configure your bot credentials and dependencies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="font-medium mb-3">Bot Configuration</p>
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              Enter your Slack bot credentials. These will be securely stored
              for your integration.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="bot-token" className="text-sm font-medium">
                Bot User OAuth Token
              </Label>
              <div className="relative mt-1">
                <Input
                  id="bot-token"
                  type={showBotToken ? "text" : "password"}
                  placeholder="xoxb-your-bot-token-here"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowBotToken(!showBotToken)}
                >
                  {showBotToken ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Found in OAuth & Permissions → Bot User OAuth Token
              </p>
            </div>

            <div>
              <Label htmlFor="signing-secret" className="text-sm font-medium">
                Signing Secret
              </Label>
              <div className="relative mt-1">
                <Input
                  id="signing-secret"
                  type={showSigningSecret ? "text" : "password"}
                  placeholder="your-signing-secret-here"
                  value={signingSecret}
                  onChange={(e) => setSigningSecret(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowSigningSecret(!showSigningSecret)}
                >
                  {showSigningSecret ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Found in Basic Information → App Credentials → Signing Secret
              </p>
            </div>
          </div>

          {(botToken || signingSecret) && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <CheckCircle className="w-4 h-4 inline mr-2" />
                Credentials entered successfully. These will be securely stored
                when you complete the integration.
              </p>
            </div>
          )}

          {botToken && signingSecret && (
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Bot Configuration
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
