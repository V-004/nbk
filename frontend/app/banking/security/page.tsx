"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DeviceVerification } from "@/components/security/device-verification"
import { SessionSecurity } from "@/components/security/session-security"
import { SuspiciousActivity } from "@/components/security/suspicious-activity"
import { FraudAlertModal } from "@/components/security/fraud-alert-modal"
import { Lock, Shield, Bell, Eye } from "lucide-react"

export default function SecurityPage() {
  const [showFraudAlert, setShowFraudAlert] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Security Center</h1>
          <p className="text-sm text-muted-foreground">Protect your account with advanced security features</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Security Status */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <CardTitle>Account Security Status</CardTitle>
                  <CardDescription>Your account is highly secure</CardDescription>
                </div>
              </div>
              <Badge className="bg-green-500">Excellent</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">2FA Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <p className="font-semibold text-sm">Enabled</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Biometric</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <p className="font-semibold text-sm">Active</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Devices</p>
                <p className="font-semibold text-sm">3 Verified</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Sessions</p>
                <p className="font-semibold text-sm">2 Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="devices" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="devices">
              <DeviceVerification />
            </TabsContent>

            <TabsContent value="sessions">
              <SessionSecurity />
            </TabsContent>

            <TabsContent value="activity">
              <SuspiciousActivity />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Preferences</CardTitle>
                  <CardDescription>Control how your account is protected</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Biometric Authentication</p>
                        <p className="text-sm text-muted-foreground">Use face or fingerprint to login</p>
                      </div>
                    </div>
                    <Switch checked={biometricEnabled} onCheckedChange={setBiometricEnabled} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive security alerts via email</p>
                      </div>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts via SMS for important events</p>
                      </div>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>

                  <Button variant="destructive" className="w-full">
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        {/* Test Alert */}
        <div className="flex justify-center">
          <Button onClick={() => setShowFraudAlert(true)} variant="outline" className="bg-transparent">
            Test Fraud Alert
          </Button>
        </div>
      </main>

      <FraudAlertModal
        isOpen={showFraudAlert}
        onClose={() => setShowFraudAlert(false)}
        alertType="suspicious_location"
        title="Suspicious Login Detected"
        description="We detected a login from an unusual location. Is this you?"
        actions={[
          { label: "Yes, This Is Me", onClick: () => setShowFraudAlert(false) },
          { label: "No, Secure My Account", onClick: () => setShowFraudAlert(false), variant: "destructive" },
        ]}
      />
    </div>
  )
}
