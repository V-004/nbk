"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScanFace, Mic, ShieldCheck, KeyRound, Smartphone, AlertTriangle } from "lucide-react"
import Link from "next/link"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export default function SecurityPage() {
    const { user } = useAuth()
    const [devices, setDevices] = useState<any[]>([])
    const [alerts, setAlerts] = useState<any[]>([])

    useEffect(() => {
        if (user?.id) {
            // Fetch Devices
            fetch(`/api/security/devices/${user.id}`)
                .then(res => res.json())
                .then(data => setDevices(data))
                .catch(err => console.error("Failed to load devices", err))

            // Fetch Alerts (Optional for now as UI didn't explicitly list them in the view I saw, but good to have)
            fetch(`/api/security/alerts/${user.id}`)
                .then(res => res.json())
                .then(data => setAlerts(data))
                .catch(err => console.error("Failed to load alerts", err))
        }
    }, [user])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
                <p className="text-muted-foreground">Manage your account security and authentication methods.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Biometric Security */}
                <Card className="border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-blue-500" />
                            Biometric Authentication
                        </CardTitle>
                        <CardDescription>Enable secure login without passwords</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-muted rounded-full">
                                    <ScanFace className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-medium">Face ID</p>
                                    <p className="text-xs text-muted-foreground">Login with facial recognition</p>
                                </div>
                            </div>
                            <Button variant="outline" asChild>
                                <Link href="/setup-face-id">Do Setup</Link>
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-muted rounded-full">
                                    <Mic className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-medium">Voice ID</p>
                                    <p className="text-xs text-muted-foreground">Login with your voice signature</p>
                                </div>
                            </div>
                            <Button variant="outline" disabled>Coming Soon</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Password & MFA */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <KeyRound className="h-5 w-5" />
                            Credentials & MFA
                        </CardTitle>
                        <CardDescription>Manage your password and dual-factor settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Change Password</Label>
                                <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                            </div>
                            <Button variant="secondary" size="sm">Update</Button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Two-Factor Authentication (2FA)</Label>
                                <p className="text-xs text-muted-foreground">Verification codes via SMS/Email</p>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Login Alerts</Label>
                                <p className="text-xs text-muted-foreground">Notify me of new logins</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Device Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Recognized Devices
                    </CardTitle>
                    <CardDescription>Manage devices that have access to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {devices.length > 0 ? devices.map((device) => (
                            <div key={device.id} className={`flex items-center justify-between p-3 border rounded-lg ${device.isCurrent ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <Smartphone className={`h-4 w-4 ${device.isCurrent ? 'text-green-600' : ''}`} />
                                    <div>
                                        <p className="text-sm font-medium">{device.name} {device.isCurrent && '(Current Device)'}</p>
                                        <p className="text-xs text-muted-foreground">Active: {new Date(device.lastActive).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {device.isCurrent ? (
                                    <div className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">Trusted</div>
                                ) : (
                                    <Button variant="ghost" size="sm" className="text-destructive">Revoke Access</Button>
                                )}
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground">No devices found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
