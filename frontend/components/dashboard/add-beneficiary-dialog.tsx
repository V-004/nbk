"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"

interface AddBeneficiaryDialogProps {
    onSuccess: () => void;
}

export function AddBeneficiaryDialog({ onSuccess }: AddBeneficiaryDialogProps) {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        accountNumber: "",
        bankName: "",
        ifscCode: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        try {
            const res = await fetch("http://localhost:5000/api/beneficiaries/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.id,
                    ...formData
                })
            })

            if (res.ok) {
                toast.success("Beneficiary added successfully")
                setOpen(false)
                setFormData({ name: "", accountNumber: "", bankName: "", ifscCode: "" })
                onSuccess()
            } else {
                toast.error("Failed to add beneficiary")
            }
        } catch (error) {
            toast.error("Network error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="justify-start w-full">
                    <UserPlus className="mr-2 h-4 w-4" /> Add New Beneficiary
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Beneficiary</DialogTitle>
                    <DialogDescription>
                        Save account details for quick transfers.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="account" className="text-right">
                            Account No.
                        </Label>
                        <Input
                            id="account"
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bank" className="text-right">
                            Bank Name
                        </Label>
                        <Input
                            id="bank"
                            value={formData.bankName}
                            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ifsc" className="text-right">
                            IFSC Code
                        </Label>
                        <Input
                            id="ifsc"
                            value={formData.ifscCode}
                            onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Beneficiary
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
