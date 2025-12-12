"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Send, Smartphone, Scan, UserPlus, History } from "lucide-react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { BiometricGuard } from "@/components/biometric-guard"
import { BeneficiaryList } from "@/components/dashboard/beneficiary-list"
import { QRScanner } from "@/components/qr-scanner"

export default function PaymentsPage() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [tab, setTab] = useState("account")

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        accountNumber: "",
        ifsc: "",
        amount: "",
        upiId: ""
    })

    const handleSelectBeneficiary = (b: any) => {
        setFormData(prev => ({
            ...prev,
            name: b.name,
            accountNumber: b.accountNumber,
            ifsc: b.ifscCode
        }))
        setTab("account")
        toast.info(`Selected ${b.name}`)
    }

    const handleScan = (data: string) => {
        setFormData(prev => ({
            ...prev,
            upiId: data
        }))
        setTab("upi")
    }

    const handleTransfer = async () => {
        // Validate based on mode
        if (tab === "account" && (!formData.accountNumber || !formData.amount)) {
            toast.error("Please fill in account details and amount")
            return
        }
        if (tab === "upi" && (!formData.upiId || !formData.amount)) {
            toast.error("Please fill in UPI ID and amount")
            return
        }

        setLoading(true)
        try {
            // Determine API payload based on mode
            const payload = tab === "account"
                ? { toAccountNumber: formData.accountNumber, amount: formData.amount, category: 'Transfer' }
                : { toAccountNumber: 'UPI-MOCK-ACC', amount: formData.amount, category: 'Transfer', note: `Sent to ${formData.upiId}` };

            const res = await fetch("http://localhost:5000/api/transactions/transfer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": localStorage.getItem("token") || ""
                },
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            if (res.ok) {
                toast.success(`Transfer Successful! Ref: ${data.transaction._id.substring(0, 8).toUpperCase()}`, {
                    description: "Details saved to transaction history."
                })
                setFormData({ name: "", accountNumber: "", ifsc: "", amount: "", upiId: "" })
            } else {
                toast.error(data.error || "Transfer Failed")
            }
        } catch (error) {
            toast.error("Network Error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                <p className="text-muted-foreground">Send money, pay bills, and manage beneficiaries.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 flex-1">

                {/* Main Payment Action Area */}
                <Card className="lg:col-span-4 h-fit">
                    <CardHeader>
                        <CardTitle>Transfer Money</CardTitle>
                        <CardDescription>Send funds securely</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={tab} onValueChange={setTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-4">
                                <TabsTrigger value="account">Bank Account</TabsTrigger>
                                <TabsTrigger value="upi">UPI ID</TabsTrigger>
                                <TabsTrigger value="mobile">Mobile</TabsTrigger>
                            </TabsList>

                            <TabsContent value="account" className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Recipient Name</Label>
                                    <Input
                                        placeholder="Enter receiver's name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Account Number</Label>
                                    <Input
                                        placeholder="Enter account number"
                                        value={formData.accountNumber}
                                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>IFSC Code</Label>
                                    <Input
                                        placeholder="Bank IFSC Code"
                                        value={formData.ifsc}
                                        onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Amount</Label>
                                    <Input
                                        placeholder="₹0.00"
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                                <div className="mt-4">
                                    <BiometricGuard
                                        onVerify={handleTransfer}
                                        title="Confirm Transfer"
                                        description={`Verify your face to send ₹${formData.amount || "0"}`}
                                    >
                                        <Button className="w-full h-12 text-lg" disabled={loading}>
                                            <Send className="w-5 h-5 mr-2" /> {loading ? "Processing..." : "Transfer Now"}
                                        </Button>
                                    </BiometricGuard>
                                </div>
                            </TabsContent>

                            <TabsContent value="upi" className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>UPI ID</Label>
                                    <Input
                                        placeholder="username@bank"
                                        value={formData.upiId}
                                        onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Amount</Label>
                                    <Input
                                        placeholder="₹0.00"
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                                <div className="mt-4">
                                    <BiometricGuard
                                        onVerify={handleTransfer}
                                        title="Confirm UPI Payment"
                                        description={`Verify to pay ₹${formData.amount || "0"}`}
                                    >
                                        <Button className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700" disabled={loading}>
                                            <Smartphone className="w-5 h-5 mr-2" /> {loading ? "Processing..." : "Pay via UPI"}
                                        </Button>
                                    </BiometricGuard>
                                </div>
                            </TabsContent>
                            <TabsContent value="mobile" className="space-y-4 text-center py-8">
                                <p className="text-muted-foreground">Mobile transfers coming locally in v2.1</p>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Side Actions & Beneficiaries */}
                <div className="lg:col-span-3 flex flex-col gap-6 h-full">
                    {/* Scan QR */}
                    <Card className="bg-primary text-primary-foreground border-none shadow-lg">
                        <CardContent className="flex flex-col items-center justify-center py-6 gap-3">
                            <div className="bg-white/20 p-3 rounded-full">
                                <Scan className="h-8 w-8" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold">Scan & Pay</h3>
                                <p className="text-primary-foreground/80 text-xs">Instant UPI Payments</p>
                            </div>
                            <QRScanner onScan={handleScan} />
                        </CardContent>
                    </Card>

                    {/* Beneficiaries List */}
                    <div className="flex-1 min-h-[300px]">
                        <BeneficiaryList onSelect={handleSelectBeneficiary} />
                    </div>
                </div>
            </div>
        </div>
    )
}
