"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

interface UPIPaymentProps {
  onSuccess?: (transactionId: string) => void
}

export function UPIPayment({ onSuccess }: UPIPaymentProps) {
  const [upiId, setUpiId] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [step, setStep] = useState<"input" | "otp" | "success" | "error">("input")
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!upiId.includes("@") || !amount) {
        throw new Error("Invalid UPI ID or amount")
      }

      setStep("otp")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed")
      setStep("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (otp.length !== 6) {
        throw new Error("Invalid OTP")
      }

      const txnId = "TXN" + Date.now().toString().slice(-10)
      setTransactionId(txnId)
      setStep("success")
      onSuccess?.(txnId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed")
      setStep("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>UPI Payment</CardTitle>
        <CardDescription>Transfer money using UPI</CardDescription>
      </CardHeader>
      <CardContent>
        {step === "input" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upi">Recipient UPI ID</Label>
              <Input
                id="upi"
                placeholder="user@bank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="Payment for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Send Money"
              )}
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOTPVerify} className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Verify Payment</strong>
              </p>
              <p className="text-sm text-blue-700 mt-1">UPI: {upiId}</p>
              <p className="text-2xl font-bold text-blue-900 mt-2">₹{amount}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP sent to your registered mobile</Label>
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

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Confirm Payment"
              )}
            </Button>
          </form>
        )}

        {step === "success" && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">Payment Successful!</p>
              <p className="text-muted-foreground">
                ₹{amount} sent to {upiId}
              </p>
            </div>
            <div className="bg-muted p-3 rounded-lg text-left">
              <p className="text-xs text-muted-foreground">Transaction ID</p>
              <p className="font-mono text-sm">{transactionId}</p>
            </div>
            <Button className="w-full" onClick={() => setStep("input")}>
              Make Another Payment
            </Button>
          </div>
        )}

        {step === "error" && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">Payment Failed</p>
              <p className="text-muted-foreground text-sm">{error}</p>
            </div>
            <Button className="w-full" onClick={() => setStep("input")}>
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
