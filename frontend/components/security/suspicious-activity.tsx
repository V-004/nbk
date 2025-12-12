"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, MapPin } from "lucide-react"

interface SuspiciousActivity {
  id: string
  type: "unusual_login" | "unusual_amount" | "unusual_location" | "failed_attempts"
  description: string
  timestamp: string
  severity: "high" | "medium" | "low"
  action?: string
}

interface SuspiciousActivityProps {
  activities?: SuspiciousActivity[]
}

export function SuspiciousActivity({ activities }: SuspiciousActivityProps) {
  const mockActivities: SuspiciousActivity[] = [
    {
      id: "act1",
      type: "unusual_location",
      description: "Login from Mumbai, India - unusual for your account",
      timestamp: "2 hours ago",
      severity: "high",
      action: "Verify",
    },
    {
      id: "act2",
      type: "unusual_amount",
      description: "Large transfer of ₹1,50,000 initiated",
      timestamp: "4 hours ago",
      severity: "high",
      action: "Review",
    },
    {
      id: "act3",
      type: "failed_attempts",
      description: "3 failed login attempts detected",
      timestamp: "6 hours ago",
      severity: "medium",
      action: "Acknowledge",
    },
    {
      id: "act4",
      type: "unusual_login",
      description: "Login during unusual hours (3:15 AM)",
      timestamp: "1 day ago",
      severity: "low",
      action: "Acknowledge",
    },
  ]

  const displayActivities = activities && activities.length > 0 ? activities : mockActivities

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "unusual_location":
        return <MapPin className="h-4 w-4" />
      case "unusual_amount":
        return <TrendingUp className="h-4 w-4" />
      case "failed_attempts":
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suspicious Activity</CardTitle>
        <CardDescription>Recent unusual activities on your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayActivities.length === 0 ? (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              No suspicious activity detected. Your account is secure.
            </AlertDescription>
          </Alert>
        ) : (
          displayActivities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start justify-between p-4 rounded-lg border ${
                activity.severity === "high"
                  ? "bg-red-50 border-red-200"
                  : activity.severity === "medium"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex gap-3 flex-1">
                <div
                  className={`mt-1 ${activity.severity === "high" ? "text-red-600" : activity.severity === "medium" ? "text-yellow-600" : "text-blue-600"}`}
                >
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{activity.description}</p>
                    <Badge className={getSeverityColor(activity.severity)}>
                      {activity.severity.charAt(0).toUpperCase() + activity.severity.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>

              {activity.action && (
                <Button size="sm" variant="ghost" className="ml-2">
                  {activity.action}
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
