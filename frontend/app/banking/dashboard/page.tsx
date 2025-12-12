"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountCard } from "@/components/banking/account-card"
import { BalanceOverview } from "@/components/banking/balance-overview"
import { QuickActions } from "@/components/banking/quick-actions"
import { TransactionList } from "@/components/banking/transaction-list"
import { PassbookView } from "@/components/banking/passbook-view"
import { AccountDetailsPanel } from "@/components/banking/account-details-panel"
import { BankingNavigation } from "@/components/banking/navigation"

export default function BankingDashboardPage() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/banking/login")
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Sample transaction data
  const transactions = [
    {
      id: "1",
      type: "debit" as const,
      category: "shopping",
      description: "Amazon Purchase",
      amount: 2500,
      date: "Today at 2:30 PM",
      status: "completed" as const,
    },
    {
      id: "2",
      type: "credit" as const,
      category: "transfer",
      description: "Salary Deposit",
      amount: 50000,
      date: "Yesterday",
      status: "completed" as const,
    },
    {
      id: "3",
      type: "debit" as const,
      category: "payment",
      description: "Electricity Bill",
      amount: 1200,
      date: "2 days ago",
      status: "completed" as const,
    },
    {
      id: "4",
      type: "debit" as const,
      category: "transfer",
      description: "Transfer to Friend",
      amount: 5000,
      date: "3 days ago",
      status: "pending" as const,
    },
    {
      id: "5",
      type: "credit" as const,
      category: "other",
      description: "Freelance Project",
      amount: 15000,
      date: "1 week ago",
      status: "completed" as const,
    },
  ]

  return (
    <>
      <BankingNavigation />

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-green-50/20">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back, {user.name}!</h2>
            <p className="text-muted-foreground">Manage your account and transactions securely</p>
          </div>

          {/* Account Card */}
          <AccountCard
            accountNumber="1234567890123456"
            accountType="Savings Account"
            balance={250000}
            currency="₹"
            cardColor="bg-gradient-to-br from-orange-500 via-blue-600 to-green-600"
          />

          {/* Balance Overview */}
          <BalanceOverview totalBalance={250000} monthlyIncome={50000} monthlyExpense={18700} currency="₹" />

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <QuickActions />
          </div>

          {/* Tabs for Transactions and Account Details */}
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100">
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                Recent Transactions
              </TabsTrigger>
              <TabsTrigger value="passbook" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                Passbook
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Account Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4 mt-6">
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest 5 transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionList transactions={transactions} limit={5} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="passbook" className="mt-6">
              <PassbookView accountNumber="1234567890123456" transactions={transactions} />
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <AccountDetailsPanel
                accountHolder={user.name}
                email={user.email}
                phone={user.phone || "+91 9876543210"}
                accountNumber="1234567890123456"
                ifscCode="NEXS0000001"
                accountStatus="active"
                kycStatus="verified"
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}
