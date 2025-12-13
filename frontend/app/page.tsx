"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroSection } from "@/components/hero-section"
import { PlatformStatistics } from "@/components/platform-statistics"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Zap, Globe, Smartphone, CreditCard, Sparkles } from "lucide-react"
import { ApiMarketplace } from "@/components/api-marketplace"

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex flex-col gap-8 pb-16">
      <HeroSection />

      {/* Feature Highlights */}
      <section className="container px-4 md:px-6 space-y-6 mt-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Banking Reimagined</h2>
          <p className="text-muted-foreground text-lg">Everything you need to manage your financial life, powered by AI.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-950 dark:to-slate-900 border-none shadow-md">
            <CardHeader>
              <div className="p-3 w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4 flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <CardTitle>AI Financial Advisor</CardTitle>
              <CardDescription>Smart insights for your spending</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get real-time feedback on your financial health. Our Gemini-powered AI analyzes your transactions to give you personalized tips and warnings.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-slate-950 dark:to-slate-900 border-none shadow-md">
            <CardHeader>
              <div className="p-3 w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mb-4 flex items-center justify-center">
                <CreditCard className="h-6 w-6" />
              </div>
              <CardTitle>Virtual Cards</CardTitle>
              <CardDescription>Secure online payments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate instant virtual cards for safe online shopping. Freeze and unfreeze them with a single tap to protect your main account.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-green-50 dark:from-slate-950 dark:to-slate-900 border-none shadow-md">
            <CardHeader>
              <div className="p-3 w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 mb-4 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <CardTitle>Bank-Grade Security</CardTitle>
              <CardDescription>Your money is safe with us</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Protected by advanced encryption, 2FA, and biometric Face/Voice authentication. Control your security settings directly from the dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="bg-muted/30 w-full py-12">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Gamify Your Savings</h2>
              <p className="text-lg text-muted-foreground">
                Earn Nexus Points for every smart financial decision. Level up from Bronze to Platinum and unlock exclusive rewards. Saving money has never been this fun.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>Earn points for saving</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>Unlock badges and tiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>Compete on global leaderboards</span>
                </div>
              </div>
            </div>
            <div className="relative h-[300px] bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20"></div>
              <div className="text-center text-white z-10 p-6">
                <div className="text-5xl font-bold mb-2">Level 4</div>
                <div className="text-xl opacity-90">Platinum Saver</div>
                <div className="mt-4 inline-block bg-white/20 backdrop-blur-md rounded-full px-4 py-1 text-sm">
                  2,450 Points Earned
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6">
        <PlatformStatistics />
      </div>

      <ApiMarketplace />

      <section className="container px-4 md:px-6 mt-8 mb-8">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-12 px-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Ready to join the future?</h3>
              <p className="text-primary-foreground/80 max-w-[500px]">
                Create your account in less than 2 minutes via Face ID or Voice. No paperwork required.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {isAuthenticated ? (
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/register">Open Free Account</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                    <Link href="/login">
                      Sign In
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
