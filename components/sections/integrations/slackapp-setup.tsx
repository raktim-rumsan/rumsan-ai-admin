import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SlackAppSetup() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            1
          </div>
          Create Your Slack App
        </CardTitle>
        <CardDescription>
          Set up your Slack application with the required permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">
              1
            </div>
            <div>
              <p className="font-medium">Go to Slack API</p>
              <p className="text-sm text-muted-foreground">
                Visit api.slack.com/apps and click &quot;Create New App&quot;
              </p>
              <Link href="https://api.slack.com/apps" target="_blank">
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Slack API
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">
              2
            </div>
            <div>
              <p className="font-medium">Choose &quot;From scratch&quot;</p>
              <p className="text-sm text-muted-foreground">
                Give your app a name and select your workspace
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">
              3
            </div>
            <div>
              <p className="font-medium">Configure OAuth & Permissions</p>
              <p className="text-sm text-muted-foreground mb-3">
                Add these bot token scopes:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="outline">app_mentions:read</Badge>
                <Badge variant="outline">chat:write</Badge>
                <Badge variant="outline">im:history</Badge>
                <Badge variant="outline">im:write</Badge>
                <Badge variant="outline">assistant:write</Badge>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">
              4
            </div>
            <div>
              <p className="font-medium">Install to Workspace</p>
              <p className="text-sm text-muted-foreground">
                Click the install button and copy your Bot User OAuth Token
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">
              5
            </div>
            <div>
              <p className="font-medium">Enable Chat Tab</p>
              <p className="text-sm text-muted-foreground">
                Under App Home → Show Tabs → Chat Tab, check &quot;Allow users
                to send Slash commands and messages from the chat tab&quot;
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
