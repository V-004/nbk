import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Lock, Zap, Code, FileText, Globe } from "lucide-react"

export function FeatureSection() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Why Choose NexusBank APIs</h2>
          <p className="text-muted-foreground max-w-[700px] mx-auto">
            Our banking APIs are designed with developers in mind, offering the perfect balance of security,
            performance, and ease of use.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 border-primary/10 bg-background">
            <CardHeader className="pb-2">
              <Lock className="h-6 w-6 text-primary" />
              <CardTitle className="mt-2">Secure</CardTitle>
              <CardDescription>OAuth 2.0, MFA, and encryption at rest and in transit</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our APIs follow OWASP security standards and banking regulations like PSD2 and GDPR.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 bg-background">
            <CardHeader className="pb-2">
              <Zap className="h-6 w-6 text-primary" />
              <CardTitle className="mt-2">Fast</CardTitle>
              <CardDescription>&lt;200ms response time for 95% of requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built for performance with caching, pagination, and horizontal scaling.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 bg-background">
            <CardHeader className="pb-2">
              <Database className="h-6 w-6 text-primary" />
              <CardTitle className="mt-2">Scalable</CardTitle>
              <CardDescription>Support for 10,000+ concurrent API calls</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our infrastructure scales automatically to handle your growth and peak loads.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 bg-background">
            <CardHeader className="pb-2">
              <Code className="h-6 w-6 text-primary" />
              <CardTitle className="mt-2">Developer-First</CardTitle>
              <CardDescription>Comprehensive docs, SDKs, and sandbox</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Everything you need to integrate quickly with code samples in multiple languages.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 bg-background">
            <CardHeader className="pb-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle className="mt-2">Well Documented</CardTitle>
              <CardDescription>Clear, comprehensive API references</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Detailed documentation with examples, use cases, and best practices for every endpoint.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 bg-background">
            <CardHeader className="pb-2">
              <Globe className="h-6 w-6 text-primary" />
              <CardTitle className="mt-2">Global Support</CardTitle>
              <CardDescription>24/7 developer support and community</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access to our developer community and dedicated support team whenever you need help.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
