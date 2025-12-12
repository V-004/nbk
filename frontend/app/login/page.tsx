"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, ScanFace } from "lucide-react"
import { FaceLogin } from "@/components/face-login"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showFaceLogin, setShowFaceLogin] = useState(false)
  const { login, loginWithFaceRecognition } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") || "/dashboard"

  // This function matches the signature expected by FaceLogin onSuccess, 
  // but FaceLogin currently just calls it without args. 
  // We need to modify FaceLogin or call login API here.
  // Actually FaceLogin verifies face on client (distance < 0.5).
  // Then we should probably exchange a token on server or just trust it for this demo??
  // Wait, auth.js has /login-face-verify which creates a token given userId.
  // We need userId. FaceLogin component knows storedDescriptor but maybe it should pass back the User ID it found?
  // Let's modify FaceLogin slightly to handle the final step or do it here.
  // For now, simplicity: client verification -> success -> redirect.
  // Ideally: FaceLogin calls onSuccess with USER ID.

  const handleFaceLoginSuccess = async (userId: string) => {
    try {
      setIsLoading(true)
      // Call the context method which now hits /api/auth/login-face-verify
      // and sets the user session + redirects to dashboard
      await loginWithFaceRecognition(userId)

      // router.push(redirectPath) // Redundant as context handles redirect now, but safe to leave or remove. 
      // Context uses /dashboard, let's let context handle it.
    } catch (err) {
      console.error(err)
      setError("Face login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(email, password)
      router.push(redirectPath)
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center py-12 md:py-24">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Log in</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!showFaceLogin ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>
                <Button variant="outline" type="button" className="w-full" onClick={() => {
                  if (!email) {
                    setError("Please enter your email to identify account for Face ID");
                    return;
                  }
                  setShowFaceLogin(true)
                }}>
                  <ScanFace className="mr-2 h-4 w-4" />
                  Face ID
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <FaceLogin
                  email={email}
                  onSuccess={handleFaceLoginSuccess}
                />
                <Button variant="ghost" className="w-full" onClick={() => setShowFaceLogin(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
