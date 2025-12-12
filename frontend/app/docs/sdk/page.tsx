"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Download,
    Code,
    Terminal,
    CheckCircle2,
    Copy,
    ExternalLink,
    Package,
    Smartphone,
    Globe,
    Zap
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SDKPage() {
    const [selectedLanguage, setSelectedLanguage] = useState("javascript")
    const { toast } = useToast()

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copied to clipboard",
            description: "Code copied successfully",
            duration: 3000,
        })
    }

    return (
        <div className="container mx-auto px-4 max-w-7xl">
            <div className="space-y-8">
                <div className="max-w-4xl mx-auto space-y-4 text-center">
                    <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">NexusBank SDK</h1>
                    <p className="text-xl text-muted-foreground">
                        Official SDKs for integrating NexusBank's banking services into your applications
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <Alert>
                        <Package className="h-4 w-4" />
                        <AlertTitle>Multiple Platform Support</AlertTitle>
                        <AlertDescription>
                            Our SDKs are available for JavaScript/TypeScript, Python, Java, and mobile platforms (iOS & Android).
                        </AlertDescription>
                    </Alert>
                </div>

                <div className="space-y-6">
                    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-center">Available SDKs</h2>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedLanguage("javascript")}>
                            <CardHeader>
                                <Code className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>JavaScript/Node.js</CardTitle>
                                <CardDescription>For web and server applications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Badge variant="secondary">v2.1.0</Badge>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedLanguage("python")}>
                            <CardHeader>
                                <Terminal className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>Python</CardTitle>
                                <CardDescription>For backend services</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Badge variant="secondary">v1.8.0</Badge>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedLanguage("java")}>
                            <CardHeader>
                                <Globe className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>Java</CardTitle>
                                <CardDescription>For enterprise applications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Badge variant="secondary">v1.5.0</Badge>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedLanguage("mobile")}>
                            <CardHeader>
                                <Smartphone className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>Mobile SDKs</CardTitle>
                                <CardDescription>iOS & Android native</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Badge variant="secondary">v1.3.0</Badge>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Installation & Quick Start</CardTitle>
                        <CardDescription>Get started with the NexusBank SDK in minutes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                                <TabsTrigger value="python">Python</TabsTrigger>
                                <TabsTrigger value="java">Java</TabsTrigger>
                                <TabsTrigger value="mobile">Mobile</TabsTrigger>
                            </TabsList>

                            <TabsContent value="javascript" className="space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Installation</h3>
                                        <CodeBlock
                                            language="bash"
                                            code="npm install @nexusbank/sdk"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Initialize the SDK</h3>
                                        <CodeBlock
                                            language="javascript"
                                            code={`import NexusBank from '@nexusbank/sdk';

// Initialize with your API credentials
const nexus = new NexusBank({
  apiKey: 'your_api_key',
  apiSecret: 'your_api_secret',
  environment: 'production' // or 'sandbox'
});`}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Example: Fetch Account Balance</h3>
                                        <CodeBlock
                                            language="javascript"
                                            code={`// Get account balance
const balance = await nexus.accounts.getBalance('acc_123456');
console.log('Balance:', balance);

// Output:
// {
//   accountId: 'acc_123456',
//   balance: 50000.00,
//   currency: 'INR',
//   availableBalance: 48500.00
// }`}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Example: Make a UPI Payment</h3>
                                        <CodeBlock
                                            language="javascript"
                                            code={`// Initiate UPI payment
const payment = await nexus.payments.upi({
  from: 'acc_123456',
  to: 'user@upi',
  amount: 1000,
  description: 'Payment for services'
});

console.log('Payment Status:', payment.status);
// Output: { status: 'success', transactionId: 'txn_789' }`}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="python" className="space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Installation</h3>
                                        <CodeBlock
                                            language="bash"
                                            code="pip install nexusbank-sdk"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Initialize the SDK</h3>
                                        <CodeBlock
                                            language="python"
                                            code={`from nexusbank import NexusBank

# Initialize with your API credentials
nexus = NexusBank(
    api_key='your_api_key',
    api_secret='your_api_secret',
    environment='production'  # or 'sandbox'
)`}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Example: Fetch Account Balance</h3>
                                        <CodeBlock
                                            language="python"
                                            code={`# Get account balance
balance = nexus.accounts.get_balance('acc_123456')
print(f"Balance: ₹{balance['balance']}")

# Output:
# {
#   'accountId': 'acc_123456',
#   'balance': 50000.00,
#   'currency': 'INR',
#   'availableBalance': 48500.00
# }`}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Example: Create Virtual Card</h3>
                                        <CodeBlock
                                            language="python"
                                            code={`# Create a virtual card
card = nexus.cards.create_virtual({
    'account_id': 'acc_123456',
    'card_type': 'debit',
    'limit': 10000
})

print(f"Card Number: {card['masked_number']}")
# Output: { 'cardId': 'card_456', 'masked_number': '****1234' }`}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="java" className="space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Installation (Maven)</h3>
                                        <CodeBlock
                                            language="xml"
                                            code={`<dependency>
    <groupId>com.nexusbank</groupId>
    <artifactId>nexusbank-sdk</artifactId>
    <version>1.5.0</version>
</dependency>`}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Initialize the SDK</h3>
                                        <CodeBlock
                                            language="java"
                                            code={`import com.nexusbank.NexusBank;
import com.nexusbank.models.*;

// Initialize with your API credentials
NexusBank nexus = new NexusBank.Builder()
    .apiKey("your_api_key")
    .apiSecret("your_api_secret")
    .environment(Environment.PRODUCTION)
    .build();`}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Example: Fetch Transactions</h3>
                                        <CodeBlock
                                            language="java"
                                            code={`// Get account transactions
TransactionList transactions = nexus.accounts()
    .getTransactions("acc_123456")
    .limit(10)
    .execute();

for (Transaction txn : transactions) {
    System.out.println("Amount: ₹" + txn.getAmount());
}`}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Example: Transfer Money</h3>
                                        <CodeBlock
                                            language="java"
                                            code={`// IMPS/NEFT transfer
Transfer transfer = nexus.payments()
    .transfer()
    .from("acc_123456")
    .to("acc_789012")
    .amount(5000.00)
    .method(TransferMethod.IMPS)
    .execute();

System.out.println("Transfer ID: " + transfer.getId());`}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="mobile" className="space-y-4">
                                <Tabs defaultValue="ios">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="ios">iOS (Swift)</TabsTrigger>
                                        <TabsTrigger value="android">Android (Kotlin)</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="ios" className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Installation (CocoaPods)</h3>
                                            <CodeBlock
                                                language="ruby"
                                                code={`pod 'NexusBankSDK', '~> 1.3.0'`}
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Initialize the SDK</h3>
                                            <CodeBlock
                                                language="swift"
                                                code={`import NexusBankSDK

// Initialize in AppDelegate
NexusBank.configure(
    apiKey: "your_api_key",
    apiSecret: "your_api_secret",
    environment: .production
)`}
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Example: Face ID Authentication</h3>
                                            <CodeBlock
                                                language="swift"
                                                code={`// Authenticate with Face ID
NexusBank.auth.faceID { result in
    switch result {
    case .success(let token):
        print("Authenticated: \\(token)")
    case .failure(let error):
        print("Error: \\(error)")
    }
}`}
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Example: QR Code Payment</h3>
                                            <CodeBlock
                                                language="swift"
                                                code={`// Scan and pay with QR code
NexusBank.payments.scanQR { qrData in
    NexusBank.payments.processQR(
        qrData: qrData,
        amount: 1000.0
    ) { result in
        print("Payment: \\(result.status)")
    }
}`}
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="android" className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Installation (Gradle)</h3>
                                            <CodeBlock
                                                language="gradle"
                                                code={`dependencies {
    implementation 'com.nexusbank:sdk:1.3.0'
}`}
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Initialize the SDK</h3>
                                            <CodeBlock
                                                language="kotlin"
                                                code={`import com.nexusbank.NexusBank

// Initialize in Application class
NexusBank.configure(
    apiKey = "your_api_key",
    apiSecret = "your_api_secret",
    environment = Environment.PRODUCTION
)`}
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Example: Biometric Authentication</h3>
                                            <CodeBlock
                                                language="kotlin"
                                                code={`// Authenticate with biometrics
NexusBank.auth.biometric(this) { result ->
    when (result) {
        is Success -> println("Token: \${result.token}")
        is Error -> println("Error: \${result.message}")
    }
}`}
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Example: NFC Tap-to-Pay</h3>
                                            <CodeBlock
                                                language="kotlin"
                                                code={`// Enable NFC payment
NexusBank.payments.nfc.enable { nfcReader ->
    nfcReader.onTap { cardData ->
        NexusBank.payments.processNFC(
            cardData = cardData,
            amount = 1000.0
        ) { result ->
            println("Payment: \${result.status}")
        }
    }
}`}
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-center">SDK Features</h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CheckCircle2 className="h-6 w-6 mb-2 text-green-600" />
                                <CardTitle>Account Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>Fetch account balances and details</li>
                                    <li>View transaction history</li>
                                    <li>Manage beneficiaries</li>
                                    <li>Account statements generation</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CheckCircle2 className="h-6 w-6 mb-2 text-green-600" />
                                <CardTitle>Payment Processing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>UPI payments and collections</li>
                                    <li>IMPS/NEFT/RTGS transfers</li>
                                    <li>QR code payments</li>
                                    <li>NFC tap-to-pay integration</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CheckCircle2 className="h-6 w-6 mb-2 text-green-600" />
                                <CardTitle>Card Services</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>Virtual card creation</li>
                                    <li>Card tokenization</li>
                                    <li>Freeze/unfreeze cards</li>
                                    <li>Card transaction limits</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CheckCircle2 className="h-6 w-6 mb-2 text-green-600" />
                                <CardTitle>Security & Authentication</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>OAuth 2.0 authentication</li>
                                    <li>Biometric integration (Face ID/Voice)</li>
                                    <li>OTP verification</li>
                                    <li>Secure token management</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CheckCircle2 className="h-6 w-6 mb-2 text-green-600" />
                                <CardTitle>Rewards & Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>Fetch reward points balance</li>
                                    <li>Redeem rewards</li>
                                    <li>Spending analytics</li>
                                    <li>Transaction categorization</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CheckCircle2 className="h-6 w-6 mb-2 text-green-600" />
                                <CardTitle>AI Assistant Integration</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>Voice command processing</li>
                                    <li>Natural language queries</li>
                                    <li>Multi-language support</li>
                                    <li>Context-aware responses</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
                    <CardHeader>
                        <CardTitle>Additional Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Button variant="outline" className="justify-start">
                                <Download className="mr-2 h-4 w-4" />
                                Download SDK Documentation
                            </Button>
                            <Button variant="outline" className="justify-start">
                                <Code className="mr-2 h-4 w-4" />
                                View Code Examples
                            </Button>
                            <Button variant="outline" className="justify-start">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                GitHub Repository
                            </Button>
                            <Button variant="outline" className="justify-start">
                                <Zap className="mr-2 h-4 w-4" />
                                API Reference
                            </Button>
                        </div>

                        <div className="pt-4 border-t">
                            <h3 className="font-semibold mb-2">Need Help?</h3>
                            <p className="text-sm text-muted-foreground">
                                Join our developer community on Discord or reach out to our support team at{" "}
                                <a href="mailto:sdk-support@nexusbank.com" className="text-primary hover:underline">
                                    sdk-support@nexusbank.com
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
