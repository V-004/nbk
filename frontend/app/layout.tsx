import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { SocketProvider } from "@/providers/socket-provider"
import { SocialSidebar } from "@/components/social-sidebar"
import { AiAssistant } from "@/components/ai-assistant"
import { VoiceCommand } from "@/components/voice-command"

import { PwaRegister } from "@/components/pwa-register"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NexusBank - Future of Banking",
  description: "Experience the next generation of contactless banking with AI insights, virtual cards, and rewards.",
  generator: 'v0.app',
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <SocketProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                {/* Assistant integrated globally */}

                <SocialSidebar />
                <div className="flex-1">{children}</div>
                <PwaRegister />
                <VoiceCommand />
                <AiAssistant />
                <Footer />
              </div>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
