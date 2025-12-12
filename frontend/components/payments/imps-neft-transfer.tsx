"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

interface IMPSNEFTTransferProps {
  onSuccess?: (transactionId: string) => void
}

export function IMPSNEFTTransfer({ onSuccess }: IMPSNEFTTransferProps) {
  const [transferType, setTransferType] = useState<"imps" | "neft">("imps")
  const [accountNumber, setAccountNumber] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  const [beneficiaryName, setBeneficiaryName] = useState("")
  const [amount, setAmount] = useState("")
  const [purpose, setPurpose] = useState("")
  const [step, setStep] = useState<"input" | "review" | "success" | "error">("input")
  const [isLoading, setIsLoading] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!accountNumber || !ifscCode || !beneficiaryName || !amount) {
      setError("Please fill all fields")
      return
    }

    setStep("review")
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, transferType === "imps" ? 2000 : 5000))

      const txnId = `${transferType.toUpperCase()}-` + Date.now().toString().slice(-10)
      setTransactionId(txnId)
      setStep("success")
      onSuccess?.(txnId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed")
      setStep("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>IMPS/NEFT Transfer</CardTitle>
        <CardDescription>Bank-to-bank fund transfer</CardDescription>
      </CardHeader>
      <CardContent>
        {step === "input" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Transfer Type</Label>
              <Select value={transferType} onValueChange={(v) => setTransferType(v as "imps" | "neft")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imps">IMPS (Immediate) - ₹200,000 limit</SelectItem>
                  <SelectItem value="neft">NEFT (2-3 hours) - Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiary">Beneficiary Name</Label>
              <Input
                id="beneficiary"
                placeholder="Enter name"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Account Number</Label>
              <Input
                id="account"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ifsc">IFSC Code</Label>
              <Input
                id="ifsc"
                placeholder="e.g., SBIN0001234"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose (optional)</Label>
              <Input
                id="purpose"
                placeholder="e.g., Payment for services"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        )}

        {step === "review" && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transfer Type</span>
                <span className="font-semibold">{transferType.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Beneficiary</span>
                <span className="font-semibold">{beneficiaryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Account</span>
                <span className="font-mono text-sm">{accountNumber.slice(-4).padStart(accountNumber.length, "*")}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="text-sm font-medium">Amount</span>
                <span className="text-xl font-bold">₹{amount}</span>
              </div>
            </div>

            {transferType === "neft" && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>NEFT transfers typically take 2-3 hours to process</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleConfirm} className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Transfer"
              )}
            </Button>

            <Button
              onClick={() => setStep("input")}
              variant="outline"
              className="w-full bg-transparent"
              disabled={isLoading}
            >
              Edit Details
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
              <p className="text-lg font-semibold">Transfer Initiated!</p>
              <p className="text-muted-foreground text-sm">
                ₹{amount} to {beneficiaryName}
              </p>
              {transferType === "neft" && <p className="text-xs text-amber-600 mt-2">Expected delivery: 2-3 hours</p>}
            </div>
            <div className="bg-muted p-3 rounded-lg text-left">
              <p className="text-xs text-muted-foreground">Reference Number</p>
              <p className="font-mono text-sm break-all">{transactionId}</p>
            </div>
            <Button className="w-full" onClick={() => setStep("input")}>
              Make Another Transfer
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
              <p className="text-lg font-semibold">Transfer Failed</p>
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
