"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle2 } from "lucide-react"

interface SupportTicketProps {
  onSubmit?: (ticketData: any) => Promise<void>
}

export function SupportTicket({ onSubmit }: SupportTicketProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("general")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const ticketData = { title, category, description }
      await onSubmit?.(ticketData)

      const newTicketId = "TKT-" + Date.now().toString().slice(-6)
      setTicketId(newTicketId)
      setSubmitted(true)

      // Reset form
      setTimeout(() => {
        setTitle("")
        setCategory("general")
        setDescription("")
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting ticket:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">Ticket Submitted!</p>
              <p className="text-muted-foreground text-sm">Ticket ID: {ticketId}</p>
            </div>
            <p className="text-sm text-muted-foreground">Our support team will contact you shortly via email.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Raise a Support Ticket</CardTitle>
        <CardDescription>Describe your issue and get help from our support team</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title</Label>
            <Input
              id="title"
              placeholder="e.g., Payment not received"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="transaction">Transaction Issue</SelectItem>
                <SelectItem value="security">Security Concern</SelectItem>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              placeholder="Please provide as much detail as possible..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !title || !description}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Ticket"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
