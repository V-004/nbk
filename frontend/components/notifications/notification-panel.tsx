"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react"

interface Notification {
  id: string
  type: "sms" | "email" | "push"
  title: string
  message: string
  timestamp: string
  read: boolean
  category: "transaction" | "security" | "promotion" | "alert"
}

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  notifications?: Notification[]
  onMarkAsRead?: (notificationId: string) => void
  onDelete?: (notificationId: string) => void
}

export function NotificationPanel({ isOpen, onClose, notifications, onMarkAsRead, onDelete }: NotificationPanelProps) {
  const mockNotifications: Notification[] = [
    {
      id: "n1",
      type: "push",
      title: "Payment Successful",
      message: "₹500 transferred to Rahul via UPI",
      timestamp: "2 minutes ago",
      read: false,
      category: "transaction",
    },
    {
      id: "n2",
      type: "sms",
      title: "Card Blocked",
      message: "Your card ending in 1234 has been temporarily blocked for security",
      timestamp: "1 hour ago",
      read: false,
      category: "security",
    },
    {
      id: "n3",
      type: "email",
      title: "Cashback Offer",
      message: "Get 5% cashback on all UPI transfers this weekend",
      timestamp: "3 hours ago",
      read: true,
      category: "promotion",
    },
    {
      id: "n4",
      type: "push",
      title: "Monthly Statement",
      message: "Your account statement for November is ready",
      timestamp: "1 day ago",
      read: true,
      category: "transaction",
    },
  ]

  const displayNotifications = notifications || mockNotifications
  const unreadCount = displayNotifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "security":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "transaction":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "sms":
        return "bg-purple-100 text-purple-800"
      case "email":
        return "bg-blue-100 text-blue-800"
      case "push":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full md:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && <Badge className="bg-red-600">{unreadCount} New</Badge>}
          </SheetTitle>
          <SheetDescription>Stay updated with all your banking activities</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 h-[calc(100vh-150px)] overflow-y-auto">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="archive">Archive</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {displayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all ${
                    notification.read ? "bg-background border-border" : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex gap-3">
                    {getIcon(notification.category)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-semibold text-sm">{notification.title}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-0 h-auto text-muted-foreground hover:text-destructive"
                          onClick={() => onDelete?.(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                        <Badge className={getTypeColor(notification.type)}>{notification.type.toUpperCase()}</Badge>
                      </div>
                    </div>
                    {!notification.read && (
                      <Checkbox checked={notification.read} onCheckedChange={() => onMarkAsRead?.(notification.id)} />
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="unread" className="space-y-3">
              {displayNotifications
                .filter((n) => !n.read)
                .map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 rounded-lg border bg-blue-50 border-blue-200 transition-all"
                  >
                    <div className="flex gap-3">
                      {getIcon(notification.category)}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                          <Badge className={getTypeColor(notification.type)}>{notification.type.toUpperCase()}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="archive" className="text-center py-8">
              <p className="text-muted-foreground text-sm">No archived notifications</p>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
