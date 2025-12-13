"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Code2, Globe, Lock, Zap, BarChart3 } from "lucide-react"

const products = [
    {
        title: "Identity Verification SDK",
        price: "$499",
        period: "/month",
        description: "Global KYC/AML compliance with 99.9% accuracy.",
        features: [
            "200+ Countries Supported",
            "Biometric Face Matching",
            "Real-time Document Verification",
            "Sanctions Screening"
        ],
        icon: Globe,
        popular: false,
        color: "text-blue-500",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
        title: "Transactions API",
        price: "$299",
        period: "/month",
        description: "Connect to 5,000+ banks for real-time data.",
        features: [
            "Real-time Balance Checks",
            "90-day Transaction History",
            "Unified JSON Format",
            "Webhook Notifications"
        ],
        icon: Zap,
        popular: true,
        color: "text-amber-500",
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
        title: "Fraud Shield",
        price: "$799",
        period: "/month",
        description: "AI-powered fraud detection and risk scoring.",
        features: [
            "Machine Learning Models",
            "Device Fingerprinting",
            "Behavioral Analytics",
            "Chargeback Protection"
        ],
        icon: Lock,
        popular: false,
        color: "text-rose-500",
        bgColor: "bg-rose-100 dark:bg-rose-900/30",
    },
    {
        title: "Smart Analytics",
        price: "$199",
        period: "/month",
        description: "Enrich transaction data with merchant insights.",
        features: [
            "Merchant Categorization",
            "Spending Patterns",
            "Logo & Location Data",
            "Subscription Detection"
        ],
        icon: BarChart3,
        popular: false,
        color: "text-emerald-500",
        bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    }
]

export function ApiMarketplace() {
    return (
        <section className="container px-4 md:px-6 py-16" id="api-marketplace">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                    For Developers
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Build faster with our APIs
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-lg">
                    Integrate banking features into your app with just a few lines of code.
                    Enterprise-grade reliability, startup-friendly pricing.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {products.map((product, index) => (
                    <Card key={index} className={`relative flex flex-col border-2 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${product.popular ? 'border-primary shadow-lg' : 'border-border/50'}`}>
                        {product.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <Badge className="bg-primary hover:bg-primary px-3 py-1">Most Popular</Badge>
                            </div>
                        )}

                        <CardHeader>
                            <div className={`w-12 h-12 rounded-lg ${product.bgColor} ${product.color} flex items-center justify-center mb-4`}>
                                <product.icon className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-xl">{product.title}</CardTitle>
                            <CardDescription className="h-10 mt-2">{product.description}</CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1">
                            <div className="mb-6">
                                <span className="text-3xl font-bold">{product.price}</span>
                                <span className="text-muted-foreground">{product.period}</span>
                            </div>
                            <ul className="space-y-3">
                                {product.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-sm text-muted-foreground">
                                        <Check className="h-4 w-4 mr-2 text-primary shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter>
                            <Button className="w-full" variant={product.popular ? "default" : "outline"}>
                                <Code2 className="mr-2 h-4 w-4" />
                                Get API Keys
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    )
}
