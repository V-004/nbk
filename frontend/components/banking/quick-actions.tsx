"use client"

import { Button } from "@/components/ui/button"
import { Send, QrCode, Smartphone, CreditCard, Eye, Settings } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    { icon: Send, label: "Transfer", href: "/banking/payments/transfer" },
    { icon: QrCode, label: "Scan & Pay", href: "/banking/payments/qr" },
    { icon: Smartphone, label: "Mobile Pay", href: "/banking/payments/nfc" },
    { icon: CreditCard, label: "Virtual Card", href: "/banking/cards" },
    { icon: Eye, label: "View Cards", href: "/banking/cards/list" },
    { icon: Settings, label: "Settings", href: "/banking/settings" },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link key={action.label} href={action.href}>
            <Button
              variant="outline"
              className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-transparent border border-border hover:bg-muted"
            >
              <Icon className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium text-center">{action.label}</span>
            </Button>
          </Link>
        )
      })}
    </div>
  )
}
