"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FolderOpen, Building, Bot, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ChatInterface } from "@/components/chat/ChatInterface";

export function WelcomeScreen() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Quick Actions */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/chat" className="block">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Start New Chat
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/documents" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FolderOpen className="mr-2 h-4 w-4" />
                Upload Documents
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/organization" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Building className="mr-2 h-4 w-4" />
                Manage Organization
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-600">
              <h4 className="font-medium mb-2">1. Upload Documents</h4>
              <p className="mb-4">Start by uploading documents to build your knowledge base.</p>

              <h4 className="font-medium mb-2">2. Train AI</h4>
              <p className="mb-4">Process your documents to make them searchable by the AI.</p>

              <h4 className="font-medium mb-2">3. Start Chatting</h4>
              <p>Ask questions about your documents using natural language.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-5rem)] p-0">
            <ChatInterface className="h-full rounded-b-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
