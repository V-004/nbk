"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LayoutDashboard, CreditCard, Shield, Brain, LifeBuoy, Settings, LogOut, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function BankingNavigation() {
  const { logout, user } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    logout()
    router.push("/banking/login")
  }

  const navItems = [
    { href: "/banking/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/banking/payments", label: "Payments", icon: CreditCard },
    { href: "/banking/security", label: "Security", icon: Shield },
    { href: "/banking/ai-assistant", label: "AI Assistant", icon: Brain },
    { href: "/banking/support", label: "Support", icon: LifeBuoy },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-8 bg-gradient-to-b from-orange-600 via-blue-600 to-green-600 rounded-r" />
          <Link href="/banking/dashboard" className="text-2xl font-bold">
            <span className="text-orange-600">Nexus</span>
            <span className="text-blue-600">Bank</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button variant="ghost" className="hover:bg-orange-50">
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:bg-green-50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-green-600 flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-4 py-2 text-sm">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <Link href="/banking/dashboard">
                <DropdownMenuItem className="cursor-pointer">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
              </Link>
              <Link href="/admin/dashboard">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
