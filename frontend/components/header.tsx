"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, X, User, LogOut } from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NotificationCenter } from "@/components/notification-center"

export default function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <MobileNav />
            </SheetContent>
          </Sheet>

          <Link href="/" className="hidden md:block">
            <Logo asLink={false} />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/about" className="font-medium transition-colors hover:text-foreground/80">
              About Us
            </Link>
            <Link href="/services" className="font-medium transition-colors hover:text-foreground/80">
              Services
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard" className="font-medium transition-colors hover:text-foreground/80">
                Dashboard
              </Link>
            )}
            <Link href="/support" className="font-medium transition-colors hover:text-foreground/80">
              Support
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className={cn("flex items-center", showSearch ? "block" : "hidden md:flex")}>
            <Input type="search" placeholder="Search documentation..." className="h-9 md:w-[200px] lg:w-[300px]" />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSearch(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close search</span>
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowSearch(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {isAuthenticated && <NotificationCenter />}

          <ModeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <div className="flex flex-col gap-4 p-4">
      <Link href="/">
        <Logo asLink={false} />
      </Link>
      <nav className="flex flex-col gap-3 text-sm">
        <Link href="/about" className="font-medium transition-colors hover:text-foreground/80">
          About Us
        </Link>
        <Link href="/services" className="font-medium transition-colors hover:text-foreground/80">
          Services
        </Link>
        {isAuthenticated && (
          <Link href="/dashboard" className="font-medium transition-colors hover:text-foreground/80">
            Dashboard
          </Link>
        )}
        <Link href="/support" className="font-medium transition-colors hover:text-foreground/80">
          Support
        </Link>
      </nav>
      <div className="flex flex-col gap-2 mt-4">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{user?.name}</span>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
