"use client"

import { useRef, useState } from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"

interface SupportMessage {
  id: string
  type: "user" | "support"
  content: string
  timestamp: Date
}

interface AISupportChatProps {
  onSendMessage?: (message: string) => Promise<string>
}

export function AISupportChat({ onSendMessage }: AISupportChatProps) {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: "init",
      type: "support",
      content:
        "Hello! Welcome to our 24/7 Support. I'm here to help you. What seems to be the problem? You can also ask for common solutions or raise a ticket.",
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

  const supportResponses: { [key: string]: string } = {
    payment:
      "For payment issues, please check: 1) Sufficient balance, 2) Valid recipient details, 3) Network connection. If the problem persists, raise a ticket.",
    verification:
      "For verification issues: 1) Ensure all documents are clear, 2) Use updated information, 3) Check file size < 5MB. Need more help? I can transfer you to an agent.",
    transaction:
      "To track your transaction: Go to your dashboard > Transaction History. You can also search by date or amount. Most transfers complete within 2-3 hours.",
    refund:
      "Refund requests are processed within 5-7 business days. You'll receive an email confirmation. Track your refund status in your account under 'Refunds'.",
    security:
      "Security tips: 1) Never share your OTP, 2) Enable 2FA, 3) Use biometric login, 4) Monitor suspicious activity. Report any issues immediately.",
  }

  const getSupportResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("payment")) return supportResponses.payment
    if (lowerMessage.includes("verify") || lowerMessage.includes("verification")) return supportResponses.verification
    if (lowerMessage.includes("transaction")) return supportResponses.transaction
    if (lowerMessage.includes("refund")) return supportResponses.refund
    if (lowerMessage.includes("security") || lowerMessage.includes("safe")) return supportResponses.security

    return "Thank you for your question. If you need specific help or want to raise a formal ticket, please let me know or visit the 'Raise Ticket' section. A support agent will assist you shortly."
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    const newUserMessage: SupportMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: userMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = onSendMessage ? await onSendMessage(userMessage) : getSupportResponse(userMessage)

      const newSupportMessage: SupportMessage = {
        id: `support-${Date.now()}`,
        type: "support",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newSupportMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Live Support Chat</CardTitle>
        <CardDescription>Get instant help from our AI support team</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.type === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-white text-foreground border rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.content}</p>
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
        <div className="flex gap-2">
          <Input
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
