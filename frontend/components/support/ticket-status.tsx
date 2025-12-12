"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MessageSquare } from "lucide-react"

interface Ticket {
  id: string
  title: string
  status: "open" | "in-progress" | "resolved" | "closed"
  createdDate: string
  lastUpdate: string
  category: string
  priority: "low" | "medium" | "high"
  responses: number
}

interface TicketStatusProps {
  tickets?: Ticket[]
  onViewTicket?: (ticketId: string) => void
}

export function TicketStatus({ tickets, onViewTicket }: TicketStatusProps) {
  const mockTickets: Ticket[] = [
    {
      id: "TKT-123456",
      title: "Payment not received",
      status: "in-progress",
      createdDate: "2 days ago",
      lastUpdate: "1 hour ago",
      category: "Transaction",
      priority: "high",
      responses: 2,
    },
    {
      id: "TKT-123455",
      title: "Account verification failed",
      status: "open",
      createdDate: "1 day ago",
      lastUpdate: "12 hours ago",
      category: "Technical",
      priority: "medium",
      responses: 1,
    },
    {
      id: "TKT-123454",
      title: "Card limit increase request",
      status: "resolved",
      createdDate: "5 days ago",
      lastUpdate: "2 days ago",
      category: "General",
      priority: "low",
      responses: 3,
    },
  ]

  const displayTickets = tickets || mockTickets

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-amber-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Support Tickets</CardTitle>
        <CardDescription>Track the status of your support requests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayTickets.length === 0 ? (
          <p className="text-muted-foreground text-sm">No support tickets yet</p>
        ) : (
          displayTickets.map((ticket) => (
            <div key={ticket.id} className="p-4 bg-muted/50 rounded-lg border hover:bg-muted transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{ticket.title}</p>
                  <p className="text-xs text-muted-foreground">{ticket.id}</p>
                </div>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium">{ticket.category}</p>
                </div>
                <div>
                  <p className={`text-muted-foreground ${getPriorityColor(ticket.priority)}`}>Priority</p>
                  <p className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground flex items-center justify-end gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {ticket.responses}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <p className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated: {ticket.lastUpdate}
                </p>
                <Button size="sm" variant="ghost" onClick={() => onViewTicket?.(ticket.id)}>
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
