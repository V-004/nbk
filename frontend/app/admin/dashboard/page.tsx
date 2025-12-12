"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { TransactionMonitoring } from "@/components/admin/transaction-monitoring"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { Users, TrendingUp, AlertTriangle } from "lucide-react"
import { BankingNavigation } from "@/components/banking/navigation"

export default function AdminDashboardPage() {
  const [searchUser, setSearchUser] = useState("")

  return (
    <>
      <BankingNavigation />

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-green-50/20">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Page Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-muted-foreground">System Management & Monitoring</p>
          </div>

          {/* System Status */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-600" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">5,340</p>
                <p className="text-xs text-muted-foreground mt-1">Online now: 234</p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">99.8%</p>
                  <Badge className="bg-green-100 text-green-800">Good</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Uptime this month</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  Flagged Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">12</p>
                <p className="text-xs text-red-600 mt-1">Require review</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">System Load</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold">45%</p>
                  <Badge className="bg-green-100 text-green-800">Optimal</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">CPU & Memory</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100">
              <TabsTrigger value="users" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                User Management
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Transaction Monitoring
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Analytics
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="users" className="space-y-4">
                <Card className="border-orange-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>Manage user accounts, verify KYC, and control access</CardDescription>
                      </div>
                      <Button className="bg-orange-600 hover:bg-orange-700">Add User</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search by name or email..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline" className="bg-transparent border-orange-300">
                        Filter
                      </Button>
                    </div>
                    <UserManagementTable />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4">
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle>Transaction Monitoring</CardTitle>
                    <CardDescription>Review and approve flagged transactions, prevent fraud</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TransactionMonitoring />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <AnalyticsDashboard />
              </TabsContent>
            </div>
          </Tabs>

          {/* System Logs */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
              <CardDescription>Latest admin actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-orange-50/50 rounded-lg border-l-4 border-orange-500">
                  <div>
                    <p className="font-semibold text-sm">User Account Suspended</p>
                    <p className="text-xs text-muted-foreground">Account: rajesh@example.com</p>
                  </div>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50/50 rounded-lg border-l-4 border-green-600">
                  <div>
                    <p className="font-semibold text-sm">Large Transaction Approved</p>
                    <p className="text-xs text-muted-foreground">Transaction: TXN-001 · Amount: ₹5,00,000</p>
                  </div>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-lg border-l-4 border-blue-600">
                  <div>
                    <p className="font-semibold text-sm">Payment Reversed</p>
                    <p className="text-xs text-muted-foreground">Transaction: TXN-002 · Reason: Fraud detected</p>
                  </div>
                  <p className="text-xs text-muted-foreground">8 hours ago</p>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50/50 rounded-lg border-l-4 border-orange-500">
                  <div>
                    <p className="font-semibold text-sm">KYC Verification Completed</p>
                    <p className="text-xs text-muted-foreground">User: priya@example.com · Status: Approved</p>
                  </div>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
