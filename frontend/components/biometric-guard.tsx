"use client"

import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FaceLogin } from "@/components/face-login"
import { useAuth } from "@/contexts/auth-context"
import { ShieldCheck } from "lucide-react"

interface BiometricGuardProps {
    children: React.ReactNode // The trigger button
    onVerify: () => void
    title?: string
    description?: string
}

export function BiometricGuard({
    children,
    onVerify,
    title = "Security Verification",
    description = "Please verify your identity to proceed."
}: BiometricGuardProps) {
    const [open, setOpen] = useState(false)
    const { user } = useAuth()

    const handleSuccess = () => {
        setOpen(false)
        onVerify()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center p-4">
                    {user?.email ? (
                        <FaceLogin
                            email={user.email}
                            onSuccess={handleSuccess}
                        />
                    ) : (
                        <div className="text-center text-destructive p-4">
                            Error: User email not found. Please re-login.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
