"use client"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Send, Zap, ShoppingCart } from "lucide-react"

interface Transaction {
  id: string
  type: "debit" | "credit"
  category: "transfer" | "payment" | "shopping" | "utility" | "other"
  description: string
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
  merchant?: string
}

interface TransactionListProps {
  transactions: Transaction[]
  limit?: number
}

export function TransactionList({ transactions, limit }: TransactionListProps) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions

  const getIcon = (category: string) => {
    switch (category) {
      case "transfer":
        return <Send className="h-4 w-4" />
      case "payment":
        return <Zap className="h-4 w-4" />
      case "shopping":
        return <ShoppingCart className="h-4 w-4" />
      default:
        return <ArrowDown className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-3">
      {displayTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === "debit" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
              }`}
            >
              {transaction.type === "debit" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </div>

            <div className="flex-1">
              <p className="font-medium text-sm">{transaction.description}</p>
              <p className="text-xs text-muted-foreground">{transaction.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className={`font-semibold ${transaction.type === "debit" ? "text-red-600" : "text-green-600"}`}>
                {transaction.type === "debit" ? "-" : "+"}₹{transaction.amount.toLocaleString()}
              </p>
              <Badge className={`text-xs ${getStatusColor(transaction.status)}`} variant="secondary">
                {transaction.status}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
