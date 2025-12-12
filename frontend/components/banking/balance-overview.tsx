"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface BalanceOverviewProps {
  totalBalance: number
  monthlyIncome: number
  monthlyExpense: number
  currency: string
}

export function BalanceOverview({ totalBalance, monthlyIncome, monthlyExpense, currency }: BalanceOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-900">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-900">
            {currency} {totalBalance.toLocaleString()}
          </p>
          <p className="text-xs text-blue-700 mt-1">Available to spend</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Monthly Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-900">
            {currency} {monthlyIncome.toLocaleString()}
          </p>
          <p className="text-xs text-green-700 mt-1">Total received</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-900 flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Monthly Expense
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-900">
            {currency} {monthlyExpense.toLocaleString()}
          </p>
          <p className="text-xs text-red-700 mt-1">Total spent</p>
        </CardContent>
      </Card>
    </div>
  )
}
