"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

interface AccountDetailsPanelProps {
  accountHolder: string
  email: string
  phone: string
  accountNumber: string
  ifscCode: string
  accountStatus: "active" | "inactive" | "suspended"
  kycStatus: "pending" | "verified" | "rejected"
}

export function AccountDetailsPanel({
  accountHolder,
  email,
  phone,
  accountNumber,
  ifscCode,
  accountStatus,
  kycStatus,
}: AccountDetailsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Your account details and verification status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Account Holder</p>
            <p className="font-semibold">{accountHolder}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Account Number</p>
            <p className="font-mono text-sm">{accountNumber.slice(-4).padStart(accountNumber.length, "*")}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Email</p>
            <p className="text-sm break-all">{email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Phone</p>
            <p className="text-sm">{phone}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">IFSC Code</p>
            <p className="font-mono text-sm">{ifscCode}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Account Status</p>
            <Badge className={accountStatus === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {accountStatus.charAt(0).toUpperCase() + accountStatus.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium">KYC Verification</p>
              <p className="text-xs text-blue-600">
                {kycStatus === "verified" ? "Verified" : kycStatus === "pending" ? "Pending" : "Not verified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium">2FA Security</p>
              <p className="text-xs text-green-600">Enabled and Active</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
