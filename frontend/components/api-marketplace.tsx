"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Code2, Globe, Lock, Zap, BarChart3, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import axios from "axios"

// Map icon strings from DB to Lucide components
const iconMap: any = {
    Globe, Zap, Lock, BarChart3
}

export function ApiMarketplace() {
    const { user, isAuthenticated } = useAuth()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/marketplace/products")
            setProducts(res.data)
        } catch (err) {
            console.error("Failed to load products", err)
            // Fallback or empty state could be handled here
        } finally {
            setLoading(false)
        }
    }

    const handleSubscribe = async (product: any) => {
        if (!isAuthenticated || !user) {
            toast.error("Please sign in to subscribe")
            return
        }

        setProcessingId(product._id)
        try {
            const res = await axios.post("http://localhost:5000/api/marketplace/subscribe", {
                email: user.email,
                apiId: product.apiId
            })

            if (res.data.success) {
                toast.success(res.data.message)
                toast.info(`API Key: ${res.data.subscription.apiKey}`)
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || "Subscription failed";
            toast.error(errorMsg)
        } finally {
            setProcessingId(null)
        }
    }

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

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {products.map((product, index) => {
                        const Icon = iconMap[product.icon] || Zap
                        const isProcessing = processingId === product._id
                        // Handle both dynamic DB products and static fallback structure styles if needed
                        // For now assuming DB returns consistent structure
                        const bgColor = "bg-primary/10"
                        const textColor = "text-primary"

                        return (
                            <Card key={product._id || index} className={`relative flex flex-col border-2 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${product.isPopular ? 'border-primary shadow-lg' : 'border-border/50'}`}>
                                {product.isPopular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-primary hover:bg-primary px-3 py-1">Most Popular</Badge>
                                    </div>
                                )}

                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg ${bgColor} ${textColor} flex items-center justify-center mb-4`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">{product.name}</CardTitle>
                                    <CardDescription className="h-10 mt-2">{product.description}</CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <div className="mb-6">
                                        <span className="text-3xl font-bold">${product.price}</span>
                                        <span className="text-muted-foreground">{product.period || '/month'}</span>
                                    </div>
                                    <ul className="space-y-3">
                                        {product.features.map((feature: string, i: number) => (
                                            <li key={i} className="flex items-center text-sm text-muted-foreground">
                                                <Check className="h-4 w-4 mr-2 text-primary shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        variant={product.isPopular ? "default" : "outline"}
                                        onClick={() => handleSubscribe(product)}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Code2 className="mr-2 h-4 w-4" />
                                        )}
                                        {isProcessing ? "Processing..." : "Subscribe"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
        </section>
    )
}
