import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CodeBlock } from "@/components/code-block"
import {
    BookOpen,
    Code,
    Key,
    Rocket,
    CheckCircle2,
    ArrowRight,
    Info
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Getting Started - NexusBank Developer Portal",
    description: "Quick start guide for integrating with NexusBank API",
}

export default function GettingStartedPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Getting Started</h1>
                <p className="text-xl text-muted-foreground">
                    Get up and running with NexusBank API in minutes. Follow this guide to make your first API call.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <span className="text-2xl font-bold text-primary">1</span>
                        </div>
                        <CardTitle className="mt-4">Create Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Sign up for a NexusBank developer account to access the API dashboard.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <span className="text-2xl font-bold text-primary">2</span>
                        </div>
                        <CardTitle className="mt-4">Get API Keys</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Generate your API credentials from the developer dashboard.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <span className="text-2xl font-bold text-primary">3</span>
                        </div>
                        <CardTitle className="mt-4">Make API Call</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Use your credentials to authenticate and make your first API request.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <span className="text-2xl font-bold text-primary">4</span>
                        </div>
                        <CardTitle className="mt-4">Go Live</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Test in sandbox, then switch to production when ready.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Sandbox Environment</AlertTitle>
                <AlertDescription>
                    Use our sandbox environment to test your integration without affecting real accounts. All sandbox API calls use the base URL: <code className="text-xs">https://sandbox-api.nexusbank.com/v1</code>
                </AlertDescription>
            </Alert>

            <div className="space-y-4">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Quick Start Example</h2>
                <p className="text-muted-foreground">
                    Here's a simple example to fetch account information using Node.js:
                </p>

                <CodeBlock
                    language="javascript"
                    code={`// Install required packages
// npm install node-fetch

const fetch = require('node-fetch');

// Your API credentials
const CLIENT_ID = 'your_client_id';
const CLIENT_SECRET = 'your_client_secret';
const API_BASE_URL = 'https://api.nexusbank.com/v1';

// Step 1: Get access token
async function getAccessToken() {
  const response = await fetch('https://auth.nexusbank.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

// Step 2: Fetch accounts
async function fetchAccounts() {
  const token = await getAccessToken();
  
  const response = await fetch(\`\${API_BASE_URL}/accounts\`, {
    headers: {
      'Authorization': \`Bearer \${token}\`,
      'Content-Type': 'application/json',
    },
  });

  const accounts = await response.json();
  console.log('Accounts:', accounts);
  return accounts;
}

// Run the example
fetchAccounts()
  .then(() => console.log('Success!'))
  .catch(err => console.error('Error:', err));`}
                />
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Prerequisites</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Development Environment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Node.js 16+ or Python 3.8+</p>
                                    <p className="text-sm text-muted-foreground">For running code examples</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">API Testing Tool</p>
                                    <p className="text-sm text-muted-foreground">Postman, Insomnia, or cURL</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Code Editor</p>
                                    <p className="text-sm text-muted-foreground">VS Code, Sublime, or similar</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Knowledge Requirements</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">REST API Basics</p>
                                    <p className="text-sm text-muted-foreground">HTTP methods, status codes</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">OAuth 2.0</p>
                                    <p className="text-sm text-muted-foreground">Authentication flow understanding</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">JSON</p>
                                    <p className="text-sm text-muted-foreground">Data format for requests/responses</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Next Steps</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/docs/authentication">
                        <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                            <CardHeader>
                                <Key className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>Authentication</CardTitle>
                                <CardDescription>Learn about OAuth 2.0 and API keys</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="ghost" className="w-full justify-between">
                                    Read Guide
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/docs/api">
                        <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                            <CardHeader>
                                <Code className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>API Reference</CardTitle>
                                <CardDescription>Explore all available endpoints</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="ghost" className="w-full justify-between">
                                    View APIs
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/sandbox">
                        <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                            <CardHeader>
                                <Rocket className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>Try Sandbox</CardTitle>
                                <CardDescription>Test APIs in live environment</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="ghost" className="w-full justify-between">
                                    Open Sandbox
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>

            <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
                <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                    <CardDescription>Our support team is here to assist you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-sm">
                        <strong>Email:</strong> <a href="mailto:developers@nexusbank.com" className="text-primary hover:underline">developers@nexusbank.com</a>
                    </p>
                    <p className="text-sm">
                        <strong>Discord:</strong> <a href="#" className="text-primary hover:underline">Join our developer community</a>
                    </p>
                    <p className="text-sm">
                        <strong>Documentation:</strong> <a href="/docs" className="text-primary hover:underline">Browse full documentation</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
