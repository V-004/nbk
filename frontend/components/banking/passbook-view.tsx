"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"
import { TransactionList } from "./transaction-list"

interface PassbookViewProps {
  accountNumber: string
  transactions: Array<{
    id: string
    type: "debit" | "credit"
    category: string
    description: string
    amount: number
    date: string
    status: string
  }>
}

export function PassbookView({ accountNumber, transactions }: PassbookViewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Passbook</CardTitle>
            <CardDescription>Account {accountNumber.slice(-4).padStart(accountNumber.length, "*")}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TransactionList transactions={transactions} />
      </CardContent>
    </Card>
  )
}
