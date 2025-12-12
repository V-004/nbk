"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Gift, Zap, ArrowRight, Loader2 } from "lucide-react"
import confetti from 'canvas-confetti'

export default function RewardsPage() {
    const { user } = useAuth()
    const [points, setPoints] = useState(0)
    const [tier, setTier] = useState('BRONZE')
    const [loading, setLoading] = useState(true)
    const [history, setHistory] = useState<any[]>([])

    useEffect(() => {
        if (user?.id) fetchRewards()
    }, [user])

    const fetchRewards = async () => {
        try {
            const res = await fetch(`/api/rewards/${user?.id}`);
            const data = await res.json();
            setPoints(data.totalPoints || 0);
            setTier(data.tier || 'BRONZE');
            setHistory(data.history || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const claimBonus = async () => {
        try {
            // Trigger earn endpoint
            const res = await fetch('/api/rewards/earn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id, points: 50, reason: 'Daily Login Bonus' })
            });

            if (res.ok) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                fetchRewards(); // Refresh
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Logic for progress
    const getNextTier = () => {
        if (tier === 'BRONZE') return { name: 'SILVER', target: 1000 };
        if (tier === 'SILVER') return { name: 'GOLD', target: 5000 };
        if (tier === 'GOLD') return { name: 'PLATINUM', target: 10000 };
        return { name: 'MAX', target: points }; // Already max
    }

    const nextTier = getNextTier();
    const progress = Math.min(100, (points / nextTier.target) * 100);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nexus Rewards</h1>
                    <p className="text-muted-foreground">Earn points and unlock exclusive benefits.</p>
                </div>
                <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/20 px-4 py-2 rounded-full text-yellow-700 dark:text-yellow-500 font-bold">
                    <Trophy className="h-5 w-5" />
                    {tier} MEMBER
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-indigo-100">
                            <Star className="h-5 w-5 fill-current" /> Total Points
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-5xl font-bold mb-4">{points.toLocaleString()}</div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-indigo-100">
                                <span>Progress to {nextTier.name}</span>
                                <span>{points} / {nextTier.target}</span>
                            </div>
                            <Progress value={progress} className="h-2 bg-indigo-900/50" indicatorColor="bg-yellow-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Available Rewards</CardTitle>
                        <CardDescription>Redeem your points for perks.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                    <Gift className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Free Transfer Fee</p>
                                    <p className="text-xs text-muted-foreground">500 Points</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" disabled={points < 500}>Redeem</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Instant Cashback (1%)</p>
                                    <p className="text-xs text-muted-foreground">2000 Points</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" disabled={points < 2000}>Redeem</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Earn More Section */}
            <div>
                <h2 className="text-xl font-bold mb-4">Ways to Earn</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="cursor-pointer hover:border-indigo-500 transition-colors" onClick={claimBonus}>
                        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                            <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                <Zap className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-bold">Daily Login</p>
                                <p className="text-sm text-muted-foreground">+50 Points</p>
                            </div>
                            <Button size="sm" variant="ghost" className="text-indigo-600">Claim Now</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                <ArrowRight className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-bold">Make a Transfer</p>
                                <p className="text-sm text-muted-foreground">+100 Points</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-bold">Complete KYC</p>
                                <p className="text-sm text-muted-foreground">+500 Points</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* History Table */}
            <Card>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {history.length > 0 ? history.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium">{item.reason}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`font-bold ${item.type === 'EARN' ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.type === 'EARN' ? '+' : '-'}{item.points}
                                </span>
                            </div>
                        )) : (
                            <p className="text-muted-foreground text-sm">No points history yet.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function Shield(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
    )
}
