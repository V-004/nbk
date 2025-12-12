"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Camera, CheckCircle2, AlertCircle } from "lucide-react"

interface QRCodePaymentProps {
  onSuccess?: (transactionId: string) => void
}

export function QRCodePayment({ onSuccess }: QRCodePaymentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [step, setStep] = useState<"scan" | "confirm" | "success" | "error">("scan")
  const [isScanning, setIsScanning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [qrData, setQrData] = useState<{ merchant: string; upi: string; amount?: number } | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleStartScanning = async () => {
    try {
      setIsScanning(true)
      setError(null)

      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Simulate QR code scanning
      setTimeout(() => {
        setQrData({
          merchant: "ABC Store",
          upi: "abcstore@bank",
          amount: 500,
        })
        setIsScanning(false)
        setStep("confirm")

        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
          tracks.forEach((track) => track.stop())
        }
      }, 2000)
    } catch (err) {
      setError("Unable to access camera")
      setIsScanning(false)
    }
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const txnId = "QR-" + Date.now().toString().slice(-10)
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
        <CardTitle>QR Code Payment</CardTitle>
        <CardDescription>Scan merchant QR code to pay</CardDescription>
      </CardHeader>
      <CardContent>
        {step === "scan" && (
          <div className="space-y-4">
            {!isScanning ? (
              <Button onClick={handleStartScanning} className="w-full gap-2">
                <Camera className="h-4 w-4" />
                Start Scanning QR Code
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  <div className="animate-pulse">Scanning QR Code...</div>
                </div>
                <Button variant="outline" className="w-full bg-transparent" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </Button>
              </div>
            )}
          </div>
        )}

        {step === "confirm" && qrData && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Merchant</span>
                <span className="font-semibold">{qrData.merchant}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-sm font-medium">Amount</span>
                <span className="text-xl font-bold">₹{qrData.amount || customAmount}</span>
              </div>
            </div>

            {!qrData.amount && (
              <div className="space-y-2">
                <Label htmlFor="amount">Enter Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>
            )}

            <Button
              onClick={handleConfirm}
              className="w-full"
              disabled={isLoading || (!qrData.amount && !customAmount)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </Button>

            <Button
              onClick={() => setStep("scan")}
              variant="outline"
              className="w-full bg-transparent"
              disabled={isLoading}
            >
              Scan Another QR
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
              <p className="text-lg font-semibold">Payment Successful!</p>
              <p className="text-muted-foreground text-sm">
                ₹{qrData?.amount || customAmount} paid to {qrData?.merchant}
              </p>
            </div>
            <div className="bg-muted p-3 rounded-lg text-left">
              <p className="text-xs text-muted-foreground">Transaction ID</p>
              <p className="font-mono text-sm">{transactionId}</p>
            </div>
            <Button className="w-full" onClick={() => setStep("scan")}>
              Scan Another QR Code
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
            <Button className="w-full" onClick={() => setStep("scan")}>
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
