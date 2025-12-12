"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, Clock } from "lucide-react"

interface Session {
  id: string
  device: string
  location: string
  ipAddress: string
  loginTime: string
  lastActivity: string
  status: "active" | "idle"
  isCurrent: boolean
}

interface SessionSecurityProps {
  sessions?: Session[]
  onLogoutSession?: (sessionId: string) => Promise<void>
  onLogoutAll?: () => Promise<void>
}

export function SessionSecurity({ sessions, onLogoutSession, onLogoutAll }: SessionSecurityProps) {
  const mockSessions: Session[] = [
    {
      id: "sess1",
      device: "iPhone 15 - Safari",
      location: "New Delhi, India",
      ipAddress: "203.123.45.67",
      loginTime: "Today at 10:30 AM",
      lastActivity: "Just now",
      status: "active",
      isCurrent: true,
    },
    {
      id: "sess2",
      device: "Windows 11 - Chrome",
      location: "New Delhi, India",
      ipAddress: "203.123.45.68",
      loginTime: "Yesterday at 2:15 PM",
      lastActivity: "2 hours ago",
      status: "active",
      isCurrent: false,
    },
    {
      id: "sess3",
      device: "MacBook Pro - Firefox",
      location: "Bangalore, India",
      ipAddress: "203.123.45.69",
      loginTime: "3 days ago",
      lastActivity: "1 day ago",
      status: "idle",
      isCurrent: false,
    },
  ]

  const displaySessions = sessions && sessions.length > 0 ? sessions : mockSessions

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>Monitor your account activity across devices</CardDescription>
          </div>
          <Button variant="destructive" size="sm" onClick={onLogoutAll}>
            Logout All Other Sessions
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displaySessions.map((session) => (
          <div key={session.id} className="flex items-start justify-between p-4 bg-muted/50 rounded-lg border">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold">{session.device}</p>
                {session.isCurrent && <Badge>Current Device</Badge>}
                <Badge
                  className={session.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                >
                  {session.status === "active" ? "Active" : "Idle"}
                </Badge>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Location: {session.location}</p>
                <p>IP Address: {session.ipAddress}</p>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>
                    Login: {session.loginTime} · Last active: {session.lastActivity}
                  </span>
                </div>
              </div>
            </div>

            {!session.isCurrent && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onLogoutSession?.(session.id)}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
