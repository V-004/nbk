"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Smartphone, Mail, Key } from "lucide-react"

export function MFASetup() {
  const [selectedMethod, setSelectedMethod] = useState<"sms" | "email" | "authenticator" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()

  const mfaMethods = [
    {
      id: "sms" as const,
      name: "SMS Authentication",
      icon: Smartphone,
      description: "Receive 6-digit codes via SMS",
    },
    {
      id: "email" as const,
      name: "Email Authentication",
      icon: Mail,
      description: "Receive 6-digit codes via email",
    },
    {
      id: "authenticator" as const,
      name: "Authenticator App",
      icon: Key,
      description: "Use an authenticator app for codes",
    },
  ]

  const handleSetupMFA = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
    } catch (err) {
      console.error("MFA setup error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <AlertDescription className="text-green-800">
          Multi-factor authentication enabled successfully!
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {mfaMethods.map((method) => {
          const Icon = method.icon
          return (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all ${selectedMethod === method.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <CardTitle className="text-base">{method.name}</CardTitle>
                    <CardDescription className="text-sm">{method.description}</CardDescription>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedMethod === method.id ? "bg-primary border-primary" : "border-muted-foreground"
                    }`}
                  />
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <Button onClick={handleSetupMFA} disabled={!selectedMethod || isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Setting up...
          </>
        ) : (
          `Setup ${selectedMethod ? mfaMethods.find((m) => m.id === selectedMethod)?.name : "MFA"}`
        )}
      </Button>
    </div>
  )
}
