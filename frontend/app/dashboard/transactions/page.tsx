"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, ArrowDown, ArrowUp, Download } from "lucide-react"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"

export default function TransactionsPage() {
    const { user } = useAuth()
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTransactions = async () => {
            if (user?.id) {
                // First need account ID usually, or just use the dashboard endpoint if it has list
                // Or use accounts endpoint. Let's try to get account first then statement.
                try {
                    const accRes = await fetch(`http://localhost:5000/api/accounts/${user.id}`)
                    if (accRes.ok) {
                        const accData = await accRes.json()
                        const txRes = await fetch(`http://localhost:5000/api/accounts/${accData.id}/statement`)
                        if (txRes.ok) {
                            setTransactions(await txRes.json())
                        }
                    }
                } catch (e) {
                    console.error("Failed to load transactions", e)
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchTransactions()
    }, [user])
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                    <p className="text-muted-foreground">View and filter your complete financial history.</p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search by merchant, amount, or tag..." className="pl-8" />
                </div>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="transfer">Transfers</SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Last 30 Days" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7">Last 7 Days</SelectItem>
                        <SelectItem value="30">Last 30 Days</SelectItem>
                        <SelectItem value="90">Last 3 Months</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="space-y-0">
                        {/* Table Header */}
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] p-4 bg-muted/50 text-sm font-medium text-muted-foreground">
                            <div>Description</div>
                            <div>Category</div>
                            <div>Date</div>
                            <div className="text-right">Amount</div>
                        </div>

                        {/* Transaction Rows */}
                        {/* Transaction Rows */}
                        {loading ? <div className="p-4 text-center">Loading...</div> : transactions.map((tx) => (
                            <div key={tx.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] p-4 border-t items-center hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${tx.type === 'DEPOSIT' || tx.type === 'TRANSFER' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                                        {tx.type === 'DEPOSIT' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <p className="font-medium">{tx.type} - {tx.id.slice(0, 8)}</p>
                                        <p className="text-xs text-muted-foreground md:hidden">{tx.status}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">{tx.type}</div>
                                <div className="text-sm text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</div>
                                <div className={`text-right font-medium`}>
                                    ${tx.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Button variant="ghost">Load More</Button>
            </div>
        </div>
    )
}
