"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"

interface Transaction {
  id: string
  user: string
  type: "transfer" | "payment" | "withdrawal"
  amount: number
  status: "completed" | "pending" | "failed"
  fromAccount: string
  toAccount: string
  timestamp: string
  flagged: boolean
  reason?: string
}

interface TransactionMonitoringProps {
  transactions?: Transaction[]
  onApproveTransaction?: (txId: string) => void
  onRejectTransaction?: (txId: string) => void
  onViewDetails?: (txId: string) => void
}

export function TransactionMonitoring({
  transactions,
  onApproveTransaction,
  onRejectTransaction,
  onViewDetails,
}: TransactionMonitoringProps) {
  const mockTransactions: Transaction[] = [
    {
      id: "txn001",
      user: "John Doe",
      type: "transfer",
      amount: 150000,
      status: "pending",
      fromAccount: "1234567890",
      toAccount: "9876543210",
      timestamp: "2024-03-15 10:30 AM",
      flagged: true,
      reason: "Large amount transfer",
    },
    {
      id: "txn002",
      user: "Jane Smith",
      type: "payment",
      amount: 5000,
      status: "completed",
      fromAccount: "1234567891",
      toAccount: "2345678901",
      timestamp: "2024-03-15 09:45 AM",
      flagged: false,
    },
    {
      id: "txn003",
      user: "Rajesh Kumar",
      type: "transfer",
      amount: 500000,
      status: "failed",
      fromAccount: "1234567892",
      toAccount: "3456789012",
      timestamp: "2024-03-15 08:20 AM",
      flagged: true,
      reason: "Suspicious activity - unusual time and amount",
    },
    {
      id: "txn004",
      user: "Priya Patel",
      type: "withdrawal",
      amount: 25000,
      status: "completed",
      fromAccount: "1234567893",
      toAccount: "ATM-123",
      timestamp: "2024-03-14 03:15 PM",
      flagged: false,
    },
  ]

  const displayTransactions = transactions || mockTransactions

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Flagged</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayTransactions.map((transaction) => (
            <TableRow key={transaction.id} className={transaction.flagged ? "bg-red-50" : ""}>
              <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
              <TableCell>{transaction.user}</TableCell>
              <TableCell>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</TableCell>
              <TableCell className="font-semibold">₹{transaction.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(transaction.status)}>
                  {getStatusIcon(transaction.status)}
                  <span className="ml-1">
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                {transaction.flagged && (
                  <Badge className="bg-red-100 text-red-800" title={transaction.reason}>
                    Flagged
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{transaction.timestamp}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                    onClick={() => onViewDetails?.(transaction.id)}
                  >
                    View
                  </Button>
                  {transaction.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => onApproveTransaction?.(transaction.id)}
                      >
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onRejectTransaction?.(transaction.id)}>
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
