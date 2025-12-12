"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, Bell, Bot, CreditCard, LayoutDashboard, LifeBuoy, ListOrdered, Send, Settings, ShieldAlert, User, Wallet, HelpCircle } from "lucide-react"

const sidebarItems = [
  {
    title: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Accounts",
    href: "/dashboard/accounts",
    icon: Wallet,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: Send,
  },
  {
    title: "Cards",
    href: "/dashboard/cards",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Support",
    href: "/dashboard/support",
    icon: HelpCircle,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:block">
      <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12 pr-1 overflow-y-auto">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href ? "bg-secondary" : "hover:bg-transparent hover:underline",
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
