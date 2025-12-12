"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2 } from "lucide-react"

interface Device {
  id: string
  name: string
  type: "phone" | "tablet" | "computer"
  os: string
  lastActive: string
  isVerified: boolean
  isCurrent: boolean
}

interface DeviceVerificationProps {
  devices?: Device[]
  onVerifyDevice?: (deviceId: string) => Promise<void>
  onRemoveDevice?: (deviceId: string) => Promise<void>
}

export function DeviceVerification({ devices = [], onVerifyDevice, onRemoveDevice }: DeviceVerificationProps) {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mockDevices: Device[] = [
    {
      id: "dev1",
      name: "My iPhone 15",
      type: "phone",
      os: "iOS 17.2",
      lastActive: "Now",
      isVerified: true,
      isCurrent: true,
    },
    {
      id: "dev2",
      name: "Office Laptop",
      type: "computer",
      os: "Windows 11",
      lastActive: "2 hours ago",
      isVerified: true,
      isCurrent: false,
    },
    {
      id: "dev3",
      name: "New iPad",
      type: "tablet",
      os: "iPadOS 17",
      lastActive: "1 hour ago",
      isVerified: false,
      isCurrent: false,
    },
  ]

  const devicesToDisplay = devices.length > 0 ? devices : mockDevices

  const handleVerify = async () => {
    if (!selectedDeviceId) return
    setIsLoading(true)
    setError(null)

    try {
      if (otp.length !== 6) {
        throw new Error("Invalid OTP")
      }
      await onVerifyDevice?.(selectedDeviceId)
      setOtp("")
      setSelectedDeviceId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (deviceId: string) => {
    setIsLoading(true)
    try {
      await onRemoveDevice?.(deviceId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove device")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trusted Devices</CardTitle>
        <CardDescription>Manage and verify your trusted devices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {devicesToDisplay.map((device) => (
            <div key={device.id} className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold">{device.name}</p>
                  {device.isCurrent && <Badge>Current</Badge>}
                  {device.isVerified && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {!device.isVerified && <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{device.os}</p>
                <p className="text-xs text-muted-foreground">Last active: {device.lastActive}</p>
              </div>

              <div className="flex gap-2">
                {!device.isVerified && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                    onClick={() => setSelectedDeviceId(device.id)}
                  >
                    Verify
                  </Button>
                )}
                {!device.isCurrent && (
                  <Button size="sm" variant="destructive" onClick={() => handleRemove(device.id)} disabled={isLoading}>
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedDeviceId && (
          <div className="border-t pt-4 space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-900">
                Verify {devicesToDisplay.find((d) => d.id === selectedDeviceId)?.name} to ensure it's trusted
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">Enter 6-digit OTP</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={handleVerify} className="flex-1" disabled={isLoading || otp.length !== 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Device"
                )}
              </Button>
              <Button
                onClick={() => {
                  setSelectedDeviceId(null)
                  setOtp("")
                }}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
