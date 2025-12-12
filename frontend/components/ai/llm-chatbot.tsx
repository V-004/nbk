"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send, Mic } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface LLMChatbotProps {
  onSendMessage?: (message: string) => Promise<string>
  title?: string
  description?: string
}

export function LLMChatbot({
  onSendMessage,
  title = "Banking Assistant",
  description = "Ask me anything about your account",
}: LLMChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      type: "assistant",
      content:
        "Hello! I'm your AI banking assistant. How can I help you today? I can answer questions about transfers, payments, account details, and more.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sampleResponses: { [key: string]: string } = {
    balance: "Your current account balance is ₹2,50,000. You have ₹1,50,000 available for immediate withdrawal.",
    transfer: "To make a transfer, you can use UPI, IMPS, or NEFT. Which method would you like to use?",
    card: "You have 2 active virtual cards with a combined limit of ₹1,50,000. Would you like to view or manage them?",
    payment: "You can make payments through various methods including QR codes, NFC, and mobile wallets.",
    security:
      "Your account has all security features enabled including 2FA, biometric authentication, and fraud detection.",
    help: "I can help you with account management, payments, transfers, security questions, and general banking queries.",
  }

  const getResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("balance")) return sampleResponses.balance
    if (lowerMessage.includes("transfer")) return sampleResponses.transfer
    if (lowerMessage.includes("card")) return sampleResponses.card
    if (lowerMessage.includes("payment")) return sampleResponses.payment
    if (lowerMessage.includes("security")) return sampleResponses.security
    if (lowerMessage.includes("help")) return sampleResponses.help

    return "I understand your question. Let me provide you with the relevant information. For complex queries, please contact our customer support team."
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: userMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = onSendMessage ? await onSendMessage(userMessage) : getResponse(userMessage)

      const newAssistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newAssistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 max-h-96">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-white text-foreground border rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.type === "user" ? "text-white/70" : "text-muted-foreground"}`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border rounded-lg px-4 py-2 rounded-bl-none">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Ask me something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="button" size="icon" variant="ghost" disabled={isLoading}>
            <Mic className="h-4 w-4" />
          </Button>
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
