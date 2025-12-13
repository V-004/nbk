"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function HeroSection() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24 lg:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200 via-background to-background dark:from-indigo-900" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center gap-6 text-center animate-in slide-in-from-bottom-5 fade-in duration-700">
          {/* Badge Removed */}

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
            Banking that Thinks <br className="hidden sm:inline" /> Like You Do
          </h1>

          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl leading-relaxed">
            Stop managing your money alone. Let our AI Financial Advisor guide you to wealth.
            Instant virtual cards, gamified savings, and bank-grade security—all in one app.
          </p>

          <div className="flex flex-col gap-3 min-[400px]:flex-row pt-4">
            {isAuthenticated ? (
              <Button size="lg" className="h-12 px-8 text-base bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none" asChild>
                <Link href="/dashboard">
                  Go to My Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" className="h-12 px-8 text-base bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none" asChild>
                  <Link href="/register">
                    Open Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-950/50" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>

          <div className="pt-8 text-sm text-muted-foreground flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-gray-200" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`, backgroundSize: 'cover' }}></div>
              ))}
            </div>
            <p>Trusted by 10,000+ early adopters</p>
          </div>
        </div>
      </div>
    </section>
  )
}
