"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export type User = {
  id: string
  name: string
  email: string
  phone?: string
  accountNumber?: string
  role: "customer" | "admin"
  verificationStatus: "pending" | "verified" | "2fa-enabled"
  biometricEnabled: boolean
  preferredLoginMethod: "password" | "face" | "voice" | "otp"
}

export type AuthSession = {
  token: string
  refreshToken: string
  expiresAt: number
  mfaRequired: boolean
  mfaMethods: Array<"sms" | "email" | "authenticator">
}

type AuthContextType = {
  user: User | null
  session: AuthSession | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  loginWithFaceRecognition: (userId: string) => Promise<void>
  loginWithVoice: (voiceData: Blob, email?: string) => Promise<void>
  loginWithOTP: (email: string, otp: string) => Promise<void>
  requestOTP: (email: string) => Promise<void>
  verifyMFA: (method: string, code: string) => Promise<void>
  setupBiometric: () => Promise<void>
  refreshToken: () => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isMFARequired: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const storedUser = localStorage.getItem("nexusbank_user")
        const storedSession = localStorage.getItem("nexusbank_session")
        if (storedUser && storedSession) {
          setUser(JSON.parse(storedUser))
          setSession(JSON.parse(storedSession))
        }
      } catch (error) {
        console.error("Authentication error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUserLoggedIn()
  }, [])

  useEffect(() => {
    if (!session) return

    const timeUntilExpiry = session.expiresAt - Date.now()
    if (timeUntilExpiry <= 0) {
      logout()
      return
    }

    const refreshTimeout = setTimeout(
      () => {
        refreshToken()
      },
      Math.max(timeUntilExpiry - 60000, 0),
    ) // Refresh 1 minute before expiry

    return () => clearTimeout(refreshTimeout)
  }, [session])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed');
      }

      const data = await res.json();
      const { user, token } = data;

      const newUser: User = {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role === 'admin' ? 'admin' : 'customer',
        verificationStatus: 'verified',
        biometricEnabled: user.hasFaceId,
        preferredLoginMethod: 'password',
      }

      const newSession: AuthSession = {
        token: token,
        refreshToken: token, // Using same token for now as simple refresh
        expiresAt: Date.now() + 86400000, // 24 hours
        mfaRequired: false,
        mfaMethods: ["sms", "email"],
      }

      setUser(newUser)
      setSession(newSession)
      localStorage.setItem("nexusbank_user", JSON.stringify(newUser))
      localStorage.setItem("nexusbank_session", JSON.stringify(newSession))
      router.push("/dashboard") // Updated path
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, phone: string = "") => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          email,
          password,
          phoneNumber: phone
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Registration failed');
      }

      // Automatically login after register or redirect to login
      // For now, redirect to login
      router.push("/login")
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginWithFaceRecognition = async (userId: string) => {
    setLoading(true)
    try {
      // await new Promise((resolve) => setTimeout(resolve, 1500)) - Removed artificial delay

      const res = await fetch('/api/auth/login-face-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        throw new Error('Face login verification failed on server');
      }

      const data = await res.json();
      const { user, token } = data;

      const newUser: User = {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role === 'admin' ? 'admin' : 'customer',
        verificationStatus: 'verified',
        biometricEnabled: true, // Assuming if they logged in with face, it's enabled
        preferredLoginMethod: 'face',
      }

      const newSession: AuthSession = {
        token: token,
        refreshToken: token,
        expiresAt: Date.now() + 86400000,
        mfaRequired: false,
        mfaMethods: ["sms"],
      }

      setUser(newUser)
      setSession(newSession)
      localStorage.setItem("nexusbank_user", JSON.stringify(newUser))
      localStorage.setItem("nexusbank_session", JSON.stringify(newSession))
      router.push("/dashboard")
    } catch (error) {
      console.error("Face recognition login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginWithVoice = async (voiceBlob: Blob, email?: string) => {
    setLoading(true)
    try {
      if (!voiceBlob) throw new Error("No voice data provided");

      const formData = new FormData();
      formData.append('audio', voiceBlob, 'voice-login.mp3');
      if (email) formData.append('email', email);

      const res = await fetch('/api/auth/login-voice', {
        method: 'POST',
        body: formData, // mulitpart/form-data
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Voice verification failed');
      }

      const data = await res.json();
      const { user, token } = data;

      const newUser: User = {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role === 'admin' ? 'admin' : 'customer',
        verificationStatus: 'verified',
        biometricEnabled: true,
        preferredLoginMethod: "voice",
      }

      const newSession: AuthSession = {
        token: token,
        refreshToken: token,
        expiresAt: Date.now() + 3600000,
        mfaRequired: false,
        mfaMethods: ["sms"],
      }

      setUser(newUser)
      setSession(newSession)
      localStorage.setItem("nexusbank_user", JSON.stringify(newUser))
      localStorage.setItem("nexusbank_session", JSON.stringify(newSession))
      router.push("/dashboard")

    } catch (error) {
      console.error("Voice login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const loginWithOTP = async (email: string, otp: string) => {
    setLoading(true)
    try {
      // Artificial delay removed

      if (otp.length !== 6) {
        throw new Error("Invalid OTP")
      }

      const newUser: User = {
        id: "usr_" + Math.random().toString(36).substring(2, 11),
        name: email.split("@")[0],
        email,
        role: "customer",
        verificationStatus: "verified",
        biometricEnabled: false,
        preferredLoginMethod: "otp",
      }

      const newSession: AuthSession = {
        token: "tok_" + Math.random().toString(36).substring(2, 20),
        refreshToken: "ref_" + Math.random().toString(36).substring(2, 20),
        expiresAt: Date.now() + 3600000,
        mfaRequired: false,
        mfaMethods: ["sms", "email"],
      }

      setUser(newUser)
      setSession(newSession)
      localStorage.setItem("nexusbank_user", JSON.stringify(newUser))
      localStorage.setItem("nexusbank_session", JSON.stringify(newSession))
      router.push("/banking/dashboard")
    } catch (error) {
      console.error("OTP login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const requestOTP = async (email: string) => {
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error('Failed to send OTP');
      console.log(`OTP sent to ${email}`)
    } catch (error) {
      console.error("OTP request error:", error)
      throw error
    }
  }

  const verifyMFA = async (method: string, code: string) => {
    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email, otp: code })
      });

      if (!res.ok) throw new Error("Invalid OTP");

      if (session) {
        const updatedSession = {
          ...session,
          mfaRequired: false,
        }
        setSession(updatedSession)
        localStorage.setItem("nexusbank_session", JSON.stringify(updatedSession))
      }
    } catch (error) {
      console.error("MFA verification error:", error)
      throw error
    }
  }

  const setupBiometric = async () => {
    try {
      // Artificial delay removed

      if (user) {
        const updatedUser = {
          ...user,
          biometricEnabled: true,
        }
        setUser(updatedUser)
        localStorage.setItem("nexusbank_user", JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error("Biometric setup error:", error)
      throw error
    }
  }

  const refreshToken = async () => {
    try {
      if (!session) return

      await new Promise((resolve) => setTimeout(resolve, 500))

      const newSession: AuthSession = {
        ...session,
        token: "tok_" + Math.random().toString(36).substring(2, 20),
        expiresAt: Date.now() + 3600000,
      }

      setSession(newSession)
      localStorage.setItem("nexusbank_session", JSON.stringify(newSession))
    } catch (error) {
      console.error("Token refresh error:", error)
      logout()
    }
  }

  const logout = () => {
    // Notify server
    fetch('/api/auth/logout', { method: 'POST' }).catch(console.error);

    setUser(null)
    setSession(null)
    localStorage.removeItem("nexusbank_user")
    localStorage.removeItem("nexusbank_session")
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        login,
        register,
        loginWithFaceRecognition,
        loginWithVoice,
        loginWithOTP,
        requestOTP,
        verifyMFA,
        setupBiometric,
        refreshToken,
        logout,
        isAuthenticated: !!user && !!session,
        isMFARequired: session?.mfaRequired ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
