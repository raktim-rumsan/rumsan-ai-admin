import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, MessageSquare } from "lucide-react";

export default function Prerequisites() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          Prerequisites
        </CardTitle>
        <CardDescription>
          Make sure you have these ready before starting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-1 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Slack workspace admin access</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
