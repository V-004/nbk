"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

const COLORS = [
    "#0ea5e9", // sky-500
    "#22c55e", // green-500
    "#eab308", // yellow-500
    "#f97316", // orange-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
]

interface SpendingChartProps {
    transactions: any[]
}

export function SpendingChart({ transactions }: SpendingChartProps) {
    // Aggregate data by category
    const categoryData = transactions.reduce((acc: any, tx: any) => {
        // Only count outflows (Payment, Transfer, Withdrawal)
        if (['PAYMENT', 'TRANSFER', 'WITHDRAWAL', 'QR_PAY', 'NFC_PAY'].includes(tx.type)) {
            const category = tx.category || 'General'
            const amount = Number(tx.amount)

            if (!acc[category]) {
                acc[category] = 0
            }
            acc[category] += amount
        }
        return acc
    }, {})

    const data = Object.keys(categoryData).map((key) => ({
        name: key,
        value: categoryData[key],
    })).sort((a, b) => b.value - a.value)

    const totalSpent = data.reduce((sum, item) => sum + item.value, 0)

    if (totalSpent === 0) {
        return (
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Spending Overview</CardTitle>
                    <CardDescription>No spending data available yet.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Make transactions to see your spending breakdown.
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Spending Overview</CardTitle>
                <CardDescription>
                    Monthly expense breakdown by category
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Amount']}
                                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
