"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Send } from "lucide-react"
import { useState } from "react"

type Message = {
  text: string
  isBot: boolean
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")

  const questions = [
    "I want to know my balance. How much do I have left?",
    "Suggest questions",
    "What are my recent transactions?",
    "How can I open an account?",
  ]

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { text, isBot: false }])
    setInputValue("")

    // Add bot reply after a short delay
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "Thank you for messaging", isBot: true }])
    }, 500)
  }

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question)
  }

  return (
    <Card className="w-full max-w-md border border-border bg-card p-6 shadow-lg">
      <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <MessageCircle className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">Rumsan Banking Assistant</h3>
          <p className="text-xs text-muted-foreground">Ask me anything about your account</p>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="mb-4 max-h-64 space-y-2 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                  message.isBot ? "bg-accent text-foreground" : "bg-primary text-primary-foreground"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {messages.length === 0 && (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(question)}
              className="flex w-full items-start gap-2 rounded-lg border border-border bg-background p-3 text-left text-sm text-foreground transition-colors hover:bg-accent"
            >
              <MessageCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span>{question}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-background p-3">
        <input
          type="text"
          placeholder="Type your question..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(inputValue)
            }
          }}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 flex-shrink-0"
          onClick={() => handleSendMessage(inputValue)}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        This information is for informational and educational purposes only.
      </p>
    </Card>
  )
}