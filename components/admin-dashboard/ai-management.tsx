import Link from "next/link"
import { Bot, Database, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function AIManagementPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/dashboard/admin"
                className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-foreground">AI Management</h1>
              <p className="text-sm text-muted-foreground">Configure AI models and behavior</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Active Models */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>Active AI Models</CardTitle>
                  <CardDescription>Models currently deployed in your workspaces</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">GPT-4 Turbo</p>
                    <p className="text-sm text-muted-foreground">Customer Support Workspace</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Claude 3 Opus</p>
                    <p className="text-sm text-muted-foreground">Banking Operations Workspace</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Add New Model
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-3 text-accent">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>AI Configuration</CardTitle>
                  <CardDescription>Adjust AI behavior and response settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Auto-Learning</Label>
                  <p className="text-sm text-muted-foreground">AI learns from user interactions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sentiment Analysis</Label>
                  <p className="text-sm text-muted-foreground">Analyze user sentiment in conversations</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Multi-language Support</Label>
                  <p className="text-sm text-muted-foreground">Enable responses in multiple languages</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Training Data */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-secondary/10 p-3 text-secondary">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>Training Data</CardTitle>
                  <CardDescription>Manage knowledge base and training documents</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Documents Uploaded</p>
                    <p className="text-sm text-muted-foreground">234 files</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Training Status</p>
                    <p className="text-sm text-muted-foreground">Last trained 2 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Retrain
                  </Button>
                </div>
                <Button className="w-full mt-4">Upload Training Data</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
