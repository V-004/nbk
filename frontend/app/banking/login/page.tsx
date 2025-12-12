"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { FaceRecognitionLogin } from "@/components/auth/face-recognition-login"
import { VoiceLogin } from "@/components/auth/voice-login"
import { OTPVerification } from "@/components/auth/otp-verification"

export default function BankingLoginPage() {
  const [email, setEmail] = useState("")
  const [showOTP, setShowOTP] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 bg-gradient-to-r from-orange-600 via-blue-600 to-green-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Welcome to NexusBank</CardTitle>
            <CardDescription className="text-orange-100">Secure contactless banking at your fingertips</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs defaultValue="password" className="w-full">
              <TabsList className="grid w-full grid-cols-4 gap-1 bg-slate-100">
                <TabsTrigger
                  value="password"
                  className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  Password
                </TabsTrigger>
                <TabsTrigger
                  value="face"
                  className="text-xs data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  Face
                </TabsTrigger>
                <TabsTrigger
                  value="voice"
                  className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Voice
                </TabsTrigger>
                <TabsTrigger
                  value="otp"
                  className="text-xs data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  OTP
                </TabsTrigger>
              </TabsList>

              <TabsContent value="password" className="space-y-4 mt-6">
                <LoginForm />
              </TabsContent>

              <TabsContent value="face" className="space-y-4 mt-6">
                <FaceRecognitionLogin />
              </TabsContent>

              <TabsContent value="voice" className="space-y-4 mt-6">
                <VoiceLogin />
              </TabsContent>

              <TabsContent value="otp" className="space-y-4 mt-6">
                <OTPVerification email={email} />
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/banking/register" className="text-orange-600 font-semibold hover:underline">
                Register here
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-xs text-slate-600">
          <p>🔒 Protected by enterprise-grade security</p>
        </div>
      </div>
    </div>
  )
}
