"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Clock } from "lucide-react"

export function OTPVerification({ email, onSuccess }: { email: string; onSuccess?: () => void }) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const { loginWithOTP, requestOTP } = useAuth()

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await loginWithOTP(email, otp)
      onSuccess?.()
    } catch (err) {
      setError("Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await requestOTP(email)
      setResendCooldown(60)
      setOtp("")
      setError(null)
    } catch (err) {
      setError("Failed to resend OTP. Please try again.")
    }
  }

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="otp">Enter OTP</Label>
        <p className="text-sm text-muted-foreground">We sent a 6-digit code to {email}</p>
        <Input
          id="otp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </Button>

      <Button type="button" variant="ghost" className="w-full" disabled={resendCooldown > 0} onClick={handleResend}>
        {resendCooldown > 0 ? (
          <>
            <Clock className="mr-2 h-4 w-4" />
            Resend in {resendCooldown}s
          </>
        ) : (
          "Resend OTP"
        )}
      </Button>
    </form>
  )
}
