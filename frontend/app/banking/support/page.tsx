"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SupportTicket } from "@/components/support/support-ticket"
import { TicketStatus } from "@/components/support/ticket-status"
import { AISupportChat } from "@/components/support/ai-support-chat"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Customer Support</h1>
          <p className="text-sm text-muted-foreground">Get help and support for your banking needs</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="raise">Raise Ticket</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="chat" className="h-[600px]">
              <AISupportChat />
            </TabsContent>

            <TabsContent value="tickets">
              <TicketStatus />
            </TabsContent>

            <TabsContent value="raise">
              <div className="grid md:grid-cols-2 gap-8">
                <SupportTicket />

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Help</CardTitle>
                    <CardDescription>Common issues and solutions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 p-3 bg-muted rounded-lg">
                      <p className="font-semibold text-sm">Why is my payment pending?</p>
                      <p className="text-xs text-muted-foreground">
                        Payments typically process within 2-3 hours. Check your transaction status in the dashboard.
                      </p>
                    </div>

                    <div className="space-y-2 p-3 bg-muted rounded-lg">
                      <p className="font-semibold text-sm">How do I reset my password?</p>
                      <p className="text-xs text-muted-foreground">
                        Go to Login &gt; Forgot Password, enter your email, and follow the verification steps.
                      </p>
                    </div>

                    <div className="space-y-2 p-3 bg-muted rounded-lg">
                      <p className="font-semibold text-sm">Can I update my KYC details?</p>
                      <p className="text-xs text-muted-foreground">
                        Yes, visit Settings &gt; Profile &gt; KYC to update your information. Changes take 2-3 days.
                      </p>
                    </div>

                    <div className="space-y-2 p-3 bg-muted rounded-lg">
                      <p className="font-semibold text-sm">How do I enable 2FA?</p>
                      <p className="text-xs text-muted-foreground">
                        Go to Settings &gt; Security &gt; Two-Factor Authentication and follow the setup process.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
