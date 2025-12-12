"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Send, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { AddBeneficiaryDialog } from "./add-beneficiary-dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface Beneficiary {
    id: string
    name: string
    accountNumber: string
    bankName: string
    ifscCode: string
}

interface BeneficiaryListProps {
    onSelect: (beneficiary: Beneficiary) => void;
}

export function BeneficiaryList({ onSelect }: BeneficiaryListProps) {
    const { user } = useAuth()
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const fetchBeneficiaries = async () => {
        if (!user) return
        try {
            const res = await fetch(`http://localhost:5000/api/beneficiaries/${user.id}`)
            if (res.ok) {
                const data = await res.json()
                setBeneficiaries(data)
            }
        } catch (error) {
            console.error("Failed to fetch beneficiaries")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBeneficiaries()
    }, [user])

    const filtered = beneficiaries.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.bankName.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Beneficiaries</CardTitle>
                <CardDescription>Manage your saved accounts</CardDescription>
                <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search beneficiaries..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-4">
                <AddBeneficiaryDialog onSuccess={fetchBeneficiaries} />

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-3 w-[100px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No beneficiaries found
                    </div>
                ) : (
                    filtered.map((b) => (
                        <div key={b.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {b.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium leading-none">{b.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {b.bankName} • {b.accountNumber.slice(-4)}
                                    </p>
                                </div>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => onSelect(b)}>
                                <Send className="h-4 w-4 text-primary" />
                            </Button>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
