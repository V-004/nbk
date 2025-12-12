"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle2, AlertCircle, Smartphone } from "lucide-react"

interface NFCPaymentProps {
  onSuccess?: (transactionId: string) => void
}

export function NFCPayment({ onSuccess }: NFCPaymentProps) {
  const [step, setStep] = useState<"ready" | "scanning" | "confirm" | "success" | "error">("ready")
  const [isLoading, setIsLoading] = useState(false)
  const [merchantData, setMerchantData] = useState<{ name: string; amount: number } | null>(null)
  const [transactionId, setTransactionId] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleStartNFC = async () => {
    setIsLoading(true)
    setError(null)

    try {
      setStep("scanning")

      // Simulate NFC detection
      await new Promise((resolve) => setTimeout(resolve, 2500))

      setMerchantData({
        name: "Premium Store",
        amount: 1500,
      })

      setStep("confirm")
    } catch (err) {
      setError("NFC device not detected")
      setStep("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const txnId = "NFC-" + Date.now().toString().slice(-10)
      setTransactionId(txnId)
      setStep("success")
      onSuccess?.(txnId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed")
      setStep("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>NFC Tap-to-Pay</CardTitle>
        <CardDescription>Contactless payment using NFC technology</CardDescription>
      </CardHeader>
      <CardContent>
        {step === "ready" && (
          <div className="space-y-4 text-center">
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Smartphone className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">Ready for NFC Payment</p>
              <p className="text-sm text-muted-foreground">Keep your device near the NFC reader to pay contactlessly</p>
            </div>
            <Button onClick={handleStartNFC} size="lg" className="w-full">
              Activate NFC
            </Button>
          </div>
        )}

        {step === "scanning" && (
          <div className="space-y-4 text-center">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center">
                <Smartphone className="h-10 w-10 text-blue-600 animate-pulse" />
              </div>
              <div className="absolute inset-0 border-2 border-blue-600 rounded-full animate-ping opacity-75"></div>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">Waiting for NFC Reader</p>
              <p className="text-sm text-muted-foreground animate-pulse">Tap your device near the POS terminal...</p>
            </div>
          </div>
        )}

        {step === "confirm" && merchantData && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Merchant</span>
                <span className="font-semibold">{merchantData.name}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-sm font-medium">Amount to Pay</span>
                <span className="text-xl font-bold">₹{merchantData.amount}</span>
              </div>
            </div>

            <Button onClick={handleConfirm} className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Payment"
              )}
            </Button>

            <Button
              onClick={() => setStep("ready")}
              variant="outline"
              className="w-full bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">Payment Complete</p>
              <p className="text-muted-foreground text-sm">
                ₹{merchantData?.amount} paid to {merchantData?.name}
              </p>
            </div>
            <div className="bg-muted p-3 rounded-lg text-left">
              <p className="text-xs text-muted-foreground">Transaction ID</p>
              <p className="font-mono text-sm">{transactionId}</p>
            </div>
            <Button className="w-full" onClick={() => setStep("ready")}>
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
            <Button className="w-full" onClick={() => setStep("ready")}>
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
