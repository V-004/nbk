"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, TrendingUp, AlertTriangle, Lightbulb, CheckCircle2, Sparkles, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface InsightData {
    healthScore: number;
    praise: string;
    warning: string;
    tip: string;
}

export function SpendingInsights({ userId }: { userId: string }) {
    const [data, setData] = useState<InsightData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        fetch('/api/ai/analyze-spending', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        })
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [userId]);

    if (loading) {
        return (
            <Card className="col-span-3 bg-gradient-to-br from-violet-600 to-indigo-700 text-white border-0">
                <CardHeader>
                    <Skeleton className="h-6 w-32 bg-white/20" />
                    <Skeleton className="h-4 w-48 bg-white/20 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-full bg-white/20" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24 bg-white/20" />
                            <Skeleton className="h-8 w-16 bg-white/20" />
                        </div>
                    </div>
                    <div className="space-y-2 pt-4">
                        <Skeleton className="h-4 w-full bg-white/20" />
                        <Skeleton className="h-4 w-3/4 bg-white/20" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!data) return null;

    // Determine color based on score
    const scoreColor = data.healthScore >= 80 ? 'text-green-600' : data.healthScore >= 50 ? 'text-yellow-600' : 'text-red-600';
    const progressColor = data.healthScore >= 80 ? 'bg-green-600' : data.healthScore >= 50 ? 'bg-yellow-600' : 'bg-red-600';

    return (
        <Card className="h-full border-indigo-200 bg-gradient-to-br from-white to-indigo-50/50 dark:from-slate-950 dark:to-indigo-950/20 dark:border-indigo-900">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    AI Financial Advisor
                </CardTitle>
                <CardDescription>Real-time analysis powered by Gemini</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Financial Health Score</p>
                        <p className={`text-3xl font-bold ${scoreColor}`}>{data.healthScore}/100</p>
                    </div>
                    {/* Simple Circular Progress Presentation */}
                    <div className="relative h-16 w-16">
                        <svg className="h-full w-full" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#eee"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeDasharray={`${data.healthScore}, 100`}
                                className={`${scoreColor}`}
                            />
                        </svg>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex gap-3 items-start p-2 rounded-lg bg-green-100/50 dark:bg-green-900/20">
                        <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                        <p className="text-sm">{data.praise}</p>
                    </div>
                    <div className="flex gap-3 items-start p-2 rounded-lg bg-red-100/50 dark:bg-red-900/20">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                        <p className="text-sm">{data.warning}</p>
                    </div>
                    <div className="flex gap-3 items-start p-2 rounded-lg bg-blue-100/50 dark:bg-blue-900/20">
                        <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium">{data.tip}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
