"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, CreditCard, Lock, Eye, EyeOff, Trash2 } from "lucide-react"

export default function CardsPage() {
    const { user } = useAuth()
    const [cards, setCards] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showDetails, setShowDetails] = useState<Record<string, boolean>>({})

    useEffect(() => {
        if (user?.id) fetchCards()
    }, [user])

    const fetchCards = async () => {
        try {
            const res = await fetch(`/api/cards/${user?.id}`);
            const data = await res.json();
            setCards(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const createVirtualCard = async () => {
        try {
            const res = await fetch('/api/cards/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id, type: 'VIRTUAL' })
            });
            if (res.ok) fetchCards();
        } catch (err) {
            console.error(err);
        }
    }

    const toggleDetails = (cardId: string) => {
        setShowDetails(prev => ({ ...prev, [cardId]: !prev[cardId] }));
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Cards</h1>
                    <p className="text-muted-foreground">Manage your physical and virtual cards.</p>
                </div>
                <Button onClick={createVirtualCard}>
                    <Plus className="mr-2 h-4 w-4" /> New Virtual Card
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <div key={card.id} className={`relative h-56 w-full rounded-xl p-6 text-white shadow-xl transition-all hover:scale-105 ${card.type === 'VIRTUAL' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-slate-700 to-slate-900'}`}>
                        <div className="flex justify-between items-start">
                            <CreditCard className="h-8 w-8 opacity-80" />
                            <span className="text-xs font-mono uppercase tracking-widest opacity-80">{card.type}</span>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="font-mono text-2xl tracking-widest drop-shadow-md">
                                {showDetails[card.id] ? (card.cardNumber || '**** **** **** ' + card.last4) : '**** **** **** ' + (card.cardNumber ? card.cardNumber.slice(-4) : 'XXXX')}
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs opacity-70">Card Holder</p>
                                    <p className="font-medium tracking-wide uppercase">{user?.name || 'Nexus User'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs opacity-70">Expires</p>
                                    <p className="font-medium">{new Date(card.expiryDate).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="absolute  bottom-4 right-4 flex gap-2">
                            {/* In a real app, we would fetch the sensitive details only on click. Here we simulated having them or masking. logic is slightly simplified for demo UI */}
                            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 border-0" onClick={() => toggleDetails(card.id)}>
                                {showDetails[card.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {cards.length === 0 && !loading && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-muted-foreground">
                        <CreditCard className="h-12 w-12 mb-4 opacity-50" />
                        <p>No cards found. Create one to get started!</p>
                    </div>
                )}
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Card Settings</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Security Preferences</CardTitle>
                        <CardDescription>Manage limits and usage controls</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="space-y-1">
                                <p className="font-medium">Online Transactions</p>
                                <p className="text-xs text-muted-foreground">Enable or disable internet payments</p>
                            </div>
                            <Button variant="outline" size="sm">Enabled</Button>
                        </div>
                        <div className="flex items-center justify-between p-4">
                            <div className="space-y-1">
                                <p className="font-medium">International Usage</p>
                                <p className="text-xs text-muted-foreground">Allow transactions outside your country</p>
                            </div>
                            <Button variant="outline" size="sm">Disabled</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
