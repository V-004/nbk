"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Shield, Lock, Search, Loader2 } from "lucide-react"

export default function AdminPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Admin secret or check?
    // In real app, we check if user.role === 'admin'

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const verifyKYC = async (userId: string, status: 'VERIFIED' | 'REJECTED') => {
        await fetch(`/api/admin/verify-kyc/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        fetchUsers(); // Refresh
    }

    const freezeAccount = async (userId: string) => {
        await fetch(`/api/admin/freeze/${userId}`, { method: 'POST' });
        fetchUsers();
    }

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
                    <p className="text-muted-foreground">Manage users, approvals, and security.</p>
                </div>
                <Button variant="outline"><Shield className="mr-2 h-4 w-4" /> Admin Access</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User Registry</CardTitle>
                    <CardDescription>Total Users: {users.length}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="grid grid-cols-5 bg-muted p-3 font-medium text-sm">
                            <div>Name / Email</div>
                            <div>Role</div>
                            <div>Status</div>
                            <div>KYC</div>
                            <div className="text-right">Actions</div>
                        </div>
                        {users.map((user) => (
                            <div key={user.id} className="grid grid-cols-5 items-center border-t p-3 text-sm">
                                <div>
                                    <p className="font-medium">{user.fullName}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                                <div>{user.role}</div>
                                <div>
                                    <Badge variant={user.kycStatus === 'SUSPENDED' ? 'destructive' : 'secondary'}>
                                        {user.kycStatus === 'SUSPENDED' ? 'FROZEN' : 'ACTIVE'}
                                    </Badge>
                                </div>
                                <div>
                                    <Badge className={
                                        user.kycStatus === 'VERIFIED' ? 'bg-green-500' :
                                            user.kycStatus === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'
                                    }>
                                        {user.kycStatus || 'PENDING'}
                                    </Badge>
                                </div>
                                <div className="flex justify-end gap-2">
                                    {user.kycStatus !== 'VERIFIED' && (
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => verifyKYC(user.id, 'VERIFIED')}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {user.kycStatus !== 'REJECTED' && (
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => verifyKYC(user.id, 'REJECTED')}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-orange-600" title="Freeze" onClick={() => freezeAccount(user.id)}>
                                        <Lock className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
