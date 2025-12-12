"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, BarChart3, Key, Loader2 } from "lucide-react"
import Link from "next/link"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { SpendingInsights } from "@/components/dashboard/spending-insights"

import { useSocket } from "@/providers/socket-provider"

export default function DashboardPage() {
  const { user, session } = useAuth()
  const { socket } = useSocket()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/transactions/dashboard', {
          headers: {
            'x-auth-token': session?.token || ''
          }
        })
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (session?.token) fetchData()
  }, [session])

  // Real-time listener
  useEffect(() => {
    if (!socket) return;

    socket.on('transaction_update', (tx: any) => {
      console.log("Real-time update received:", tx);
      setData((prev: any) => {
        if (!prev) return prev;

        // Calculate new balance
        const newBalance = tx.balance !== undefined ? tx.balance : prev.balance;

        // Add to recent transactions if it's a new transaction object (full object)
        // or if it's a partial update, we might need to fetch or just inject it.
        // Our backend sends: { type, amount, balance } for payment
        // and { type, amount, balance } for transfer.
        // We should ideally send the full transaction object to display it in the list.
        // Let's refetch to be safe/clean or construct a temporary object.

        // Construct temporary tx for UI
        const newTx = {
          id: 'live_' + Date.now(),
          type: tx.type,
          amount: tx.amount,
          category: tx.category || 'General',
          createdAt: new Date().toISOString()
        };

        return {
          ...prev,
          balance: newBalance.toFixed(2),
          recentTransactions: [newTx, ...prev.recentTransactions].slice(0, 10)
        };
      });
    });

    return () => {
      socket.off('transaction_update');
    };
  }, [socket]);

  if (loading) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="animate-spin h-8 w-8" /></div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Monitor your financial health and spending habits.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{data?.balance || '0.00'}</div>
            <p className="text-xs text-muted-foreground">Available Funds</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Number</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono">{data?.accountNumber || '####'}</div>
            <p className="text-xs text-muted-foreground">Savings Account</p>
          </CardContent>
        </Card>

        {/* Biometric Prompt Card */}
        {!user?.biometricEnabled && (
          <Card className="col-span-2 border-orange-500/50 bg-orange-500/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-500">Security Alert</CardTitle>
              <Key className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold">Face ID Not Setup</div>
                <p className="text-xs text-muted-foreground">Enable biometric login for faster access.</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/setup-face-id">Setup Now</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <SpendingChart transactions={data?.recentTransactions || []} />
        </div>
        <div className="col-span-3">
          <SpendingInsights userId={user?.id || ''} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.recentTransactions?.map((tx: any) => (
              <div key={tx.id} className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg border p-4">
                <div>
                  <p className="font-medium">{tx.type} {(tx.category && tx.category !== 'General') ? `- ${tx.category}` : ''}</p>
                  <p className="text-sm text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`font-bold ${['DEPOSIT'].includes(tx.type) ? 'text-green-500' : 'text-red-500'}`}>
                  {['DEPOSIT'].includes(tx.type) ? '+' : '-'}₹{tx.amount}
                </div>
              </div>
            ))}
            {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
              <p className="text-muted-foreground text-center py-4">No recent transactions</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="quick-actions">
        <TabsList>
          <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
        </TabsList>
        <TabsContent value="quick-actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Send Money</CardTitle>
                <CardDescription>Transfer funds instantly</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/dashboard/payments">
                    Transfer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pay Bills</CardTitle>
                <CardDescription>Pay utility and credit card bills</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline">
                  <Link href="/dashboard/payments">
                    Pay Bill
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Support</CardTitle>
                <CardDescription>Get help with your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="secondary">
                  <Link href="/dashboard/support">
                    Contact Agent
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
