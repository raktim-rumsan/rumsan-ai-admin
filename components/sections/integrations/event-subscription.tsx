import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Copy } from "lucide-react";
import { useState } from "react";

export default function EventSubscription() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_API;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            3
          </div>
          Configure Event Subscriptions
        </CardTitle>
        <CardDescription>
          Set up Slack to send events to your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">
              1
            </div>
            <div>
              <p className="font-medium">Deploy Your Application</p>
              <p className="text-sm text-muted-foreground">
                Deploy to Vercel or your preferred hosting platform
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">
              2
            </div>
            <div>
              <p className="font-medium">Add Request URL</p>
              <p className="text-sm text-muted-foreground">
                In your Slack app settings, go to Event Subscriptions and add
                our app endpoint:
              </p>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm bg-slate-100 px-2 py-1 rounded flex-1">
                  {`${baseUrl}/api/v1/slack/events`}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900"
                  onClick={() =>
                    copyToClipboard(
                      `${baseUrl}/api/v1/slack/events`,
                      "webhook-url"
                    )
                  }
                >
                  {copiedCode === "webhook-url" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-1">
              3
            </div>
            <div>
              <p className="font-medium">Subscribe to Bot Events</p>
              <p className="text-sm text-muted-foreground mb-2">
                Add these specific bot events for our integration:
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">app_mention</Badge>
                <Badge variant="outline">message.im</Badge>
                <Badge variant="outline">assistant_thread_started</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                These events enable your bot to respond to mentions and direct
                messages.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
