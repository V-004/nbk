import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
    Shield,
    Smartphone,
    Zap,
    Globe,
    Lock,
    CreditCard,
    Brain,
    Fingerprint,
    Mic,
    QrCode,
    Wallet,
    TrendingUp
} from "lucide-react"

export const metadata: Metadata = {
    title: "Banking System Overview - NexusBank",
    description: "Learn about NexusBank's advanced digital banking platform",
}

export default function BankingSystemPage() {
    return (
        <div className="container mx-auto px-4 max-w-7xl">
            <div className="space-y-8">
                <div className="max-w-4xl mx-auto space-y-4 text-center">
                    <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Banking System Overview</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        NexusBank is a next-generation digital banking platform that combines cutting-edge technology with seamless user experience to deliver secure, intelligent, and contactless banking services.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertTitle>Enterprise-Grade Security</AlertTitle>
                        <AlertDescription>
                            All transactions are protected with bank-level encryption, biometric authentication, and real-time fraud detection.
                        </AlertDescription>
                    </Alert>
                </div>

                <div className="space-y-6">
                    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-center">Core Features</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Fingerprint className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>Biometric Authentication</CardTitle>
                                <CardDescription>Face ID & Voice Recognition</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Secure login using advanced facial recognition and voice biometrics powered by AI models.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Brain className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>AI Assistant</CardTitle>
                                <CardDescription>Intelligent Banking Support</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    24/7 AI-powered assistant with voice commands and multilingual support for instant help.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <QrCode className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>Contactless Payments</CardTitle>
                                <CardDescription>QR & NFC Technology</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Make instant payments using QR codes or NFC tap-to-pay with virtual card tokenization.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Wallet className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>UPI & IMPS/NEFT</CardTitle>
                                <CardDescription>Instant Transfers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Send money instantly via UPI or schedule transfers using IMPS/NEFT with beneficiary management.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CreditCard className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>Virtual Cards</CardTitle>
                                <CardDescription>Secure Digital Cards</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Generate virtual cards instantly with tokenization for enhanced security and fraud prevention.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <TrendingUp className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>Rewards & Analytics</CardTitle>
                                <CardDescription>Earn While You Spend</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Earn reward points on transactions and get AI-powered spending insights and analytics.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-center">Security Features</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="border-green-200 dark:border-green-900">
                            <CardHeader>
                                <Lock className="h-6 w-6 mb-2 text-green-600" />
                                <CardTitle>Multi-Factor Authentication</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>Password + OTP verification</li>
                                    <li>Biometric authentication (Face ID/Voice)</li>
                                    <li>Device fingerprinting</li>
                                    <li>Session management</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-blue-200 dark:border-blue-900">
                            <CardHeader>
                                <Shield className="h-6 w-6 mb-2 text-blue-600" />
                                <CardTitle>Data Protection</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>End-to-end encryption</li>
                                    <li>Secure token storage</li>
                                    <li>PCI DSS compliance</li>
                                    <li>Regular security audits</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-purple-200 dark:border-purple-900">
                            <CardHeader>
                                <Zap className="h-6 w-6 mb-2 text-purple-600" />
                                <CardTitle>Fraud Detection</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>Real-time transaction monitoring</li>
                                    <li>AI-powered anomaly detection</li>
                                    <li>Suspicious activity alerts</li>
                                    <li>Transaction limits & controls</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-orange-200 dark:border-orange-900">
                            <CardHeader>
                                <Globe className="h-6 w-6 mb-2 text-orange-600" />
                                <CardTitle>Compliance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>KYC verification</li>
                                    <li>AML compliance</li>
                                    <li>GDPR data protection</li>
                                    <li>RBI guidelines adherence</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-center">Payment Methods</h2>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <h3 className="font-semibold">UPI Payments</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Instant transfers using UPI ID or mobile number with real-time confirmation.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold">IMPS/NEFT</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Bank transfers using account number and IFSC code with beneficiary management.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold">QR Code</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Scan and pay using dynamic QR codes for merchants and peer-to-peer transfers.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold">NFC Tap-to-Pay</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Contactless payments using virtual card tokenization for enhanced security.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-center">Account Types</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Savings Account</CardTitle>
                                <CardDescription>For daily banking needs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>Competitive interest rates</li>
                                    <li>No minimum balance</li>
                                    <li>Unlimited transactions</li>
                                    <li>Debit card included</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Current Account</CardTitle>
                                <CardDescription>For business transactions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>High transaction limits</li>
                                    <li>Overdraft facility</li>
                                    <li>Business tools integration</li>
                                    <li>Dedicated support</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Fixed Deposit</CardTitle>
                                <CardDescription>For long-term savings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>Higher interest rates</li>
                                    <li>Flexible tenure options</li>
                                    <li>Loan against FD</li>
                                    <li>Auto-renewal available</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
