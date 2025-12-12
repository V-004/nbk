"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bell, ShieldAlert, CheckCircle2, Info } from "lucide-react"

export default function NotificationsPage() {
    const notifications = [
        { id: 1, type: 'security', title: 'New Login Detected', message: 'New login from Chrome on Windows.', time: '2 mins ago', icon: ShieldAlert, color: 'text-red-500' },
        { id: 2, type: 'transaction', title: 'Payment Received', message: 'You received $4,500.00 from Employer.', time: '1 hour ago', icon: CheckCircle2, color: 'text-green-500' },
        { id: 3, type: 'info', title: 'Statement Available', message: 'Your monthly statement for November is ready.', time: '2 days ago', icon: Info, color: 'text-blue-500' },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground">Stay updated with important activity.</p>
            </div>

            <div className="space-y-4">
                {notifications.map((notif) => (
                    <Card key={notif.id} className="hover:bg-muted/50 transition-colors">
                        <CardContent className="flex items-start gap-4 p-4">
                            <div className={`p-2 rounded-full bg-muted ${notif.color}`}>
                                <notif.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="font-medium leading-none">{notif.title}</p>
                                <p className="text-sm text-muted-foreground">{notif.message}</p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {notif.time}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
