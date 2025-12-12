"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, Mic } from "lucide-react"
import { useState } from "react"

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your AI Banking Assistant. How can I help you regarding your finances today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm processing your request. This is a demo response." }]);
    }, 1000);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <p className="text-sm text-muted-foreground">Ask me about your transactions, balance, or financial advice.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border shadow-sm">
        <ScrollArea className="flex-1 p-4 bg-muted/20">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} `}>
                <div className={`flex gap - 2 max - w - [80 %] ${msg.role === 'user' ? 'flex-row-reverse' : ''} `}>
                  <div className={`h - 8 w - 8 rounded - full flex items - center justify - center shrink - 0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'} `}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`p - 3 rounded - lg text - sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-background border rounded-tl-none shadow-sm'} `}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="shrink-0">
              <Mic className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
