"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Copy, Trash2, Lock } from "lucide-react"

interface VirtualCardProps {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardHolder: string
  limit: number
  spent: number
  status: "active" | "frozen" | "expired"
}

export function VirtualCard({ cardNumber, expiryDate, cvv, cardHolder, limit, spent, status }: VirtualCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const remaining = limit - spent
  const percentage = (spent / limit) * 100

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-white/80 text-xs mb-1">Virtual Card</p>
              <Badge variant="secondary" className={status === "active" ? "bg-green-500" : "bg-red-500"}>
                {status.toUpperCase()}
              </Badge>
            </div>
            <Lock className="h-5 w-5" />
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <p className="text-white/80 text-xs mb-2">Card Number</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-lg tracking-widest">
                  {showDetails ? cardNumber : cardNumber.replace(/\d(?=\d{4})/g, "*")}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 p-1 h-auto"
                  onClick={() => handleCopy(cardNumber, "cardNumber")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/80 text-xs mb-1">Expiry</p>
                <p className="font-semibold">{expiryDate}</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white/80 text-xs">CVV</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20 p-1 h-auto"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="font-mono">{showDetails ? cvv : "***"}</p>
              </div>
            </div>

            <div>
              <p className="text-white/80 text-xs mb-1">{cardHolder}</p>
              <p className="text-sm uppercase">{cardHolder}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Spending Limit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Spent</span>
              <span className="font-semibold">₹{spent.toLocaleString()}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>₹{limit.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg text-sm">
            <p className="text-muted-foreground mb-1">Remaining Limit</p>
            <p className="text-lg font-bold">₹{remaining.toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="bg-transparent" size="sm">
              <Lock className="h-4 w-4 mr-2" />
              Freeze
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
