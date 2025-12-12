"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Copy } from "lucide-react"
import { useState } from "react"

interface AccountCardProps {
  accountNumber: string
  accountType: string
  balance: number
  currency: string
  cardColor: string
}

export function AccountCard({ accountNumber, accountType, balance, currency, cardColor }: AccountCardProps) {
  const [showBalance, setShowBalance] = useState(true)
  const [copied, setCopied] = useState(false)

  const maskedAccount = accountNumber.replace(/\d(?=\d{4})/g, "*")

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className={`relative overflow-hidden text-white ${cardColor} border-0 shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-12">
          <div>
            <p className="text-white/80 text-sm mb-1">Account Type</p>
            <p className="font-semibold">{accountType}</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-xl">💳</span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <p className="text-white/80 text-xs mb-2">Account Number</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-lg tracking-wider">{maskedAccount}</p>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-1 h-auto"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-white/80 text-xs">Available Balance</p>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-1 h-auto"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-4xl font-bold">{showBalance ? `${currency} ${balance.toLocaleString()}` : "••••••"}</p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4 flex justify-between text-xs text-white/70">
          <span>Valid Thru 12/28</span>
          <span>Contactless Enabled</span>
        </div>
      </CardContent>
    </Card>
  )
}
