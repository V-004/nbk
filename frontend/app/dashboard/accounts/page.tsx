"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, MoreHorizontal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"

export default function AccountsPage() {
    const { user } = useAuth()
    const [account, setAccount] = useState<any>(null)
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (user?.id) {
                try {
                    // Fetch Account
                    const accRes = await fetch(`http://localhost:5000/api/accounts/${user.id}`)
                    if (accRes.ok) {
                        const accData = await accRes.json()
                        setAccount(accData)

                        // Fetch Transactions
                        const txRes = await fetch(`http://localhost:5000/api/accounts/${accData.id}/statement`)
                        if (txRes.ok) {
                            const txData = await txRes.json()
                            setTransactions(txData)
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch account data", error)
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchData()
    }, [user])
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
                    <p className="text-muted-foreground">Manage your savings, checking, and investment accounts.</p>
                </div>
                <Button>Open New Account</Button>
            </div>

            {/* Account Cards Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Savings Account */}
                <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Savings Account</CardTitle>
                        <Wallet className="h-4 w-4 opacity-75" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mt-2">
                            {loading ? "..." : `₹${account?.balance || "0.00"}`}
                        </div>
                        <p className="text-xs opacity-75 mt-1">
                            {account?.accountNumber ? `**** **** **** ${account.accountNumber.slice(-4)}` : "No Account"}
                        </p>
                        <div className="mt-4 flex gap-2">
                            <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white">View Details</Button>
                            <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white">Statements</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Checking Account */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Checking Account</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mt-2">₹2,450.50</div>
                        <p className="text-xs text-muted-foreground mt-1">**** **** **** 1234</p>
                        <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm">View Details</Button>
                            <Button variant="outline" size="sm">Statements</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Card */}
                <Card className="border-dashed flex flex-col items-center justify-center p-6 text-center hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                        <ArrowUpRight className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Add Account</h3>
                    <p className="text-sm text-muted-foreground mt-1">Link a bank or open new</p>
                </Card>
            </div>

            <Tabs defaultValue="transactions" className="w-full">
                <TabsList>
                    <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                    <TabsTrigger value="statements">Statements</TabsTrigger>
                    <TabsTrigger value="details">Account Details</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>History</CardTitle>
                            <CardDescription>Recent transactions from all your accounts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {transactions.length > 0 ? (
                                    transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === 'DEPOSIT' || (tx.receiverAccountId === account?.id) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {tx.type === 'DEPOSIT' || (tx.receiverAccountId === account?.id) ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{tx.type} - {tx.id.slice(0, 8)}</p>
                                                    <p className="text-sm text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold ${tx.type === 'DEPOSIT' || (tx.receiverAccountId === account?.id) ? 'text-green-600' : 'text-red-500'}`}>
                                                    {tx.type === 'DEPOSIT' || (tx.receiverAccountId === account?.id) ? '+' : '-'}₹{tx.amount}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground py-4">No recent transactions</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="statements">
                    <Card>
                        <CardHeader>
                            <CardTitle>Statements</CardTitle>
                            <CardDescription>Download your monthly account statements</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">Statements feature coming soon.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                            <CardDescription>Full routing and account numbers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">Securely view account details here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
