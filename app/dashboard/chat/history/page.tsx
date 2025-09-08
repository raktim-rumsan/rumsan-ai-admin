"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useChatHistory, ChatMessage } from "@/queries/chatQuery";
import Link from "next/link";

export default function ChatHistoryPage() {
  const { data: chatHistory = [], isLoading } = useChatHistory();
  const [searchTerm, setSearchTerm] = React.useState("");

  // Group messages by conversation sessions (simplified approach)
  const conversations = React.useMemo(() => {
    const groups: { [key: string]: ChatMessage[] } = {};

    chatHistory.forEach((message) => {
      const dateKey = message.timestamp.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return Object.entries(groups)
      .map(([date, messages]) => ({
        date,
        messages,
        id: date,
        title: `Conversation on ${date}`,
        messageCount: messages.length,
        lastMessage: messages[messages.length - 1],
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [chatHistory]);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.messages.some((msg) => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chat History</h1>
          <p className="text-gray-600 mt-1">View and manage your conversation history</p>
        </div>
        <Link href="/dashboard/chat">
          <Button>
            <MessageSquare className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations */}
      {filteredConversations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No conversations found" : "No conversations yet"}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start your first conversation with the AI assistant"}
            </p>
            <Link href="/dashboard/chat">
              <Button>
                <MessageSquare className="w-4 h-4 mr-2" />
                Start New Chat
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredConversations.map((conversation) => (
            <Card key={conversation.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">{conversation.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{conversation.messageCount} messages</Badge>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(conversation.date).toLocaleDateString()}
                  {conversation.lastMessage && (
                    <>
                      <span>•</span>
                      <span>
                        Last message at {conversation.lastMessage.timestamp.toLocaleTimeString()}
                      </span>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {conversation.lastMessage && (
                  <div className="border-l-2 border-gray-200 pl-4">
                    <p className="text-sm text-gray-600 mb-1">
                      {conversation.lastMessage.role === "user" ? "You" : "AI Assistant"}:
                    </p>
                    <p className="text-sm text-gray-900 line-clamp-2">
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/chat">View Conversation</Link>
                  </Button>
                  <Button variant="ghost" size="sm">
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
