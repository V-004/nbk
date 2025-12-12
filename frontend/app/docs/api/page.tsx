"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"
import { useAuth } from "@/contexts/auth-context"
import { ChevronDown, ChevronRight, Copy, ExternalLink, Search } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"

export default function ApiDocumentationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Code sample copied to clipboard",
      duration: 3000,
    })
  }

  // Filter endpoints based on search term
  const filteredEndpoints = endpoints.filter(
    (endpoint) =>
      endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="space-y-8">
        <div className="max-w-4xl mx-auto space-y-4 text-center">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">API Reference</h1>
          <p className="text-xl text-muted-foreground">Comprehensive documentation for the NexusBank API</p>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search API endpoints..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>API Services</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <a href="#accounts" className="flex items-center px-4 py-2 text-sm border-b hover:bg-accent">
                  Accounts
                </a>
                <a href="#payments" className="flex items-center px-4 py-2 text-sm border-b hover:bg-accent">
                  Payments
                </a>
                <a href="#transactions" className="flex items-center px-4 py-2 text-sm border-b hover:bg-accent">
                  Transactions
                </a>
                <a href="#customers" className="flex items-center px-4 py-2 text-sm border-b hover:bg-accent">
                  Customers
                </a>
                <a href="#webhooks" className="flex items-center px-4 py-2 text-sm hover:bg-accent">
                  Webhooks
                </a>
              </nav>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Base URL and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Base URL</h3>
                  <div className="flex items-center space-x-2">
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm flex-1">
                      https://api.nexusbank.com/v1
                    </code>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard("https://api.nexusbank.com/v1")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    For sandbox testing, use <code className="text-xs">https://sandbox-api.nexusbank.com/v1</code>
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    All API requests require authentication using OAuth 2.0 Bearer tokens.
                  </p>
                  <CodeBlock
                    language="bash"
                    code={`curl -X GET "https://api.nexusbank.com/v1/accounts" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`}
                  />
                  <p className="text-sm text-muted-foreground">
                    <a href="/docs/authentication" className="text-primary hover:underline">
                      Learn more about authentication
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {filteredEndpoints.length > 0 ? (
              filteredEndpoints.map((endpoint) => <EndpointCard key={endpoint.id} endpoint={endpoint} />)
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-lg font-medium">No endpoints found</h3>
                  <p className="text-sm text-muted-foreground">No API endpoints match your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Code sample copied to clipboard",
      duration: 3000,
    })
  }

  return (
    <Card id={endpoint.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{endpoint.name}</CardTitle>
            <CardDescription>{endpoint.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                endpoint.method === "GET"
                  ? "secondary"
                  : endpoint.method === "POST"
                    ? "default"
                    : endpoint.method === "PUT"
                      ? "outline"
                      : "destructive"
              }
            >
              {endpoint.method}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm flex-1">
            {endpoint.path}
          </code>
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(endpoint.path)}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center justify-between w-full">
              <span>Details</span>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Parameters</h3>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Required</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {endpoint.parameters.map((param, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm font-mono">{param.name}</td>
                          <td className="px-4 py-2 text-sm">{param.type}</td>
                          <td className="px-4 py-2 text-sm">
                            {param.required ? (
                              <Badge
                                variant="outline"
                                className="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                              >
                                Required
                              </Badge>
                            ) : (
                              <Badge variant="outline">Optional</Badge>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {endpoint.requestBody && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Request Body</h3>
                <CodeBlock language="json" code={JSON.stringify(endpoint.requestBody, null, 2)} />
              </div>
            )}

            {endpoint.responses && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Responses</h3>
                <Tabs defaultValue="200">
                  <TabsList>
                    {Object.keys(endpoint.responses).map((status) => (
                      <TabsTrigger key={status} value={status}>
                        {status}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Object.entries(endpoint.responses).map(([status, response]) => (
                    <TabsContent key={status} value={status}>
                      <CodeBlock language="json" code={JSON.stringify(response, null, 2)} />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Code Samples</h3>
              <Tabs defaultValue="curl">
                <TabsList>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="node">Node.js</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="java">Java</TabsTrigger>
                </TabsList>
                <TabsContent value="curl">
                  <div className="relative">
                    <CodeBlock language="bash" code={endpoint.codeSamples.curl} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(endpoint.codeSamples.curl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="node">
                  <div className="relative">
                    <CodeBlock language="javascript" code={endpoint.codeSamples.node} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(endpoint.codeSamples.node)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="python">
                  <div className="relative">
                    <CodeBlock language="python" code={endpoint.codeSamples.python} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(endpoint.codeSamples.python)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="java">
                  <div className="relative">
                    <CodeBlock language="java" code={endpoint.codeSamples.java} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(endpoint.codeSamples.java)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-3 w-3" />
                Try in Sandbox
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

// Types and mock data
interface Parameter {
  name: string
  type: string
  required: boolean
  description: string
}

interface Endpoint {
  id: string
  name: string
  description: string
  path: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  parameters?: Parameter[]
  requestBody?: any
  responses: Record<string, any>
  codeSamples: {
    curl: string
    node: string
    python: string
    java: string
  }
}

const endpoints: Endpoint[] = [
  {
    id: "accounts",
    name: "List Accounts",
    description: "Retrieve a list of all accounts associated with the authenticated user",
    path: "/v1/accounts",
    method: "GET",
    parameters: [
      {
        name: "page",
        type: "integer",
        required: false,
        description: "Page number for pagination (default: 1)",
      },
      {
        name: "limit",
        type: "integer",
        required: false,
        description: "Number of results per page (default: 10, max: 100)",
      },
      {
        name: "status",
        type: "string",
        required: false,
        description: "Filter by account status (active, inactive, closed)",
      },
    ],
    responses: {
      "200": {
        data: [
          {
            id: "acc_123456",
            name: "Main Account",
            type: "checking",
            currency: "EUR",
            balance: 1500.75,
            available_balance: 1500.75,
            status: "active",
            created_at: "2023-01-15T08:30:00Z",
            _links: {
              self: "/v1/accounts/acc_123456",
              transactions: "/v1/accounts/acc_123456/transactions",
            },
          },
          {
            id: "acc_789012",
            name: "Savings Account",
            type: "savings",
            currency: "EUR",
            balance: 5000.0,
            available_balance: 5000.0,
            status: "active",
            created_at: "2023-02-20T14:15:00Z",
            _links: {
              self: "/v1/accounts/acc_789012",
              transactions: "/v1/accounts/acc_789012/transactions",
            },
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1,
        },
        _links: {
          self: "/v1/accounts?page=1&limit=10",
          first: "/v1/accounts?page=1&limit=10",
          last: "/v1/accounts?page=1&limit=10",
        },
      },
      "401": {
        error: {
          code: "unauthorized",
          message: "Authentication required",
        },
      },
      "403": {
        error: {
          code: "forbidden",
          message: "Insufficient permissions to access accounts",
        },
      },
    },
    codeSamples: {
      curl: `curl -X GET "https://api.nexusbank.com/v1/accounts" \\
      -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`,
      node: `const fetchAccounts = async () => {
  const response = await fetch('https://api.nexusbank.com/v1/accounts', {
        headers: {
        'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    }
  });

      const data = await response.json();
      console.log(data);
      return data;
};

      fetchAccounts();`,
      python: `import requests

      def fetch_accounts():
      headers = {
        'Authorization': f'Bearer {API_KEY}',
      'Content-Type': 'application/json'
    }

      response = requests.get(
      'https://api.nexusbank.com/v1/accounts',
      headers=headers
      )

      data = response.json()
      print(data)
      return data

      fetch_accounts()`,
      java: `import java.net.URI;
      import java.net.http.HttpClient;
      import java.net.http.HttpRequest;
      import java.net.http.HttpResponse;

      public String fetchAccounts() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
      HttpRequest request = HttpRequest.newBuilder()
      .uri(URI.create("https://api.nexusbank.com/v1/accounts"))
      .header("Authorization", "Bearer " + API_KEY)
      .header("Content-Type", "application/json")
      .GET()
      .build();

      HttpResponse<String> response = client.send(
        request, HttpResponse.BodyHandlers.ofString());

        System.out.println(response.body());
        return response.body();
}

        fetchAccounts();`,
    },
  },
  {
    id: "payments",
    name: "Create Payment",
    description: "Initiate a new payment from a source account to a destination account",
    path: "/v1/payments",
    method: "POST",
    requestBody: {
      source_account_id: "acc_123456",
      destination: {
        type: "iban",
        iban: "DE89370400440532013000",
        bic: "DEUTDEFFXXX",
        name: "John Doe",
      },
      amount: 100.5,
      currency: "EUR",
      description: "Invoice payment #123",
      reference: "INV-123",
      execution_date: "2023-05-15T00:00:00Z",
    },
    responses: {
      "201": {
        id: "pmt_789012",
        source_account_id: "acc_123456",
        destination: {
          type: "iban",
          iban: "DE89370400440532013000",
          bic: "DEUTDEFFXXX",
          name: "John Doe",
        },
        amount: 100.5,
        currency: "EUR",
        description: "Invoice payment #123",
        reference: "INV-123",
        status: "pending",
        execution_date: "2023-05-15T00:00:00Z",
        created_at: "2023-05-10T14:30:00Z",
        _links: {
          self: "/v1/payments/pmt_789012",
        },
      },
      "400": {
        error: {
          code: "invalid_request",
          message: "Invalid request parameters",
          details: {
            source_account_id: "Account not found",
          },
        },
      },
      "401": {
        error: {
          code: "unauthorized",
          message: "Authentication required",
        },
      },
      "403": {
        error: {
          code: "forbidden",
          message: "Insufficient permissions to create payments",
        },
      },
      "422": {
        error: {
          code: "insufficient_funds",
          message: "Insufficient funds in source account",
        },
      },
    },
    codeSamples: {
      curl: `curl -X POST "https://api.nexusbank.com/v1/payments" \\
        -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
        -H "Content-Type: application/json" \\
        -d '{
          "source_account_id": "acc_123456",
        "destination": {
          "type": "iban",
        "iban": "DE89370400440532013000",
        "bic": "DEUTDEFFXXX",
        "name": "John Doe"
    },
        "amount": 100.50,
        "currency": "EUR",
        "description": "Invoice payment #123",
        "reference": "INV-123"
  }'`,
      node: `const createPayment = async () => {
  const payment = {
          source_account_id: "acc_123456",
        destination: {
          type: "iban",
        iban: "DE89370400440532013000",
        bic: "DEUTDEFFXXX",
        name: "John Doe"
    },
        amount: 100.50,
        currency: "EUR",
        description: "Invoice payment #123",
        reference: "INV-123"
  };

        const response = await fetch('https://api.nexusbank.com/v1/payments', {
          method: 'POST',
        headers: {
          'Authorization': \`Bearer \${API_KEY}\`,
        'Content-Type': 'application/json'
    },
        body: JSON.stringify(payment)
  });

        const data = await response.json();
        console.log(data);
        return data;
};

        createPayment();`,
      python: `import requests
        import json

        def create_payment():
        headers = {
          'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }

        payment = {
          "source_account_id": "acc_123456",
        "destination": {
          "type": "iban",
        "iban": "DE  "acc_123456",
        "destination": {
          "type": "iban",
        "iban": "DE89370400440532013000",
        "bic": "DEUTDEFFXXX",
        "name": "John Doe"
        },
        "amount": 100.50,
        "currency": "EUR",
        "description": "Invoice payment #123",
        "reference": "INV-123"
    }

        response = requests.post(
        'https://api.nexusbank.com/v1/payments',
        headers=headers,
        data=json.dumps(payment)
        )

        data = response.json()
        print(data)
        return data

        create_payment()`,
      java: `import java.net.URI;
        import java.net.http.HttpClient;
        import java.net.http.HttpRequest;
        import java.net.http.HttpResponse;

        public String createPayment() throws Exception {
          String payment = """
        {
          "source_account_id": "acc_123456",
        "destination": {
          "type": "iban",
        "iban": "DE89370400440532013000",
        "bic": "DEUTDEFFXXX",
        "name": "John Doe"
            },
        "amount": 100.50,
        "currency": "EUR",
        "description": "Invoice payment #123",
        "reference": "INV-123"
        }
        """;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("https://api.nexusbank.com/v1/payments"))
        .header("Authorization", "Bearer " + API_KEY)
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(payment))
        .build();

        HttpResponse<String> response = client.send(
          request, HttpResponse.BodyHandlers.ofString());

          System.out.println(response.body());
          return response.body();
}

          createPayment();`,
    },
  },
  {
    id: "transactions",
    name: "List Transactions",
    description: "Retrieve a list of transactions for a specific account",
    path: "/v1/accounts/{account_id}/transactions",
    method: "GET",
    parameters: [
      {
        name: "account_id",
        type: "string",
        required: true,
        description: "The unique identifier of the account",
      },
      {
        name: "page",
        type: "integer",
        required: false,
        description: "Page number for pagination (default: 1)",
      },
      {
        name: "limit",
        type: "integer",
        required: false,
        description: "Number of results per page (default: 10, max: 100)",
      },
      {
        name: "from_date",
        type: "string (ISO 8601)",
        required: false,
        description: "Filter transactions from this date",
      },
      {
        name: "to_date",
        type: "string (ISO 8601)",
        required: false,
        description: "Filter transactions until this date",
      },
      {
        name: "type",
        type: "string",
        required: false,
        description: "Filter by transaction type (payment, deposit, withdrawal)",
      },
    ],
    responses: {
      "200": {
        data: [
          {
            id: "txn_123456",
            account_id: "acc_123456",
            amount: -100.5,
            currency: "EUR",
            description: "Payment to John Doe",
            type: "payment",
            status: "completed",
            created_at: "2023-05-10T14:30:00Z",
            _links: {
              self: "/v1/transactions/txn_123456",
              account: "/v1/accounts/acc_123456",
            },
          },
          {
            id: "txn_789012",
            account_id: "acc_123456",
            amount: 1500.0,
            currency: "EUR",
            description: "Salary deposit",
            type: "deposit",
            status: "completed",
            created_at: "2023-05-01T09:15:00Z",
            _links: {
              self: "/v1/transactions/txn_789012",
              account: "/v1/accounts/acc_123456",
            },
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1,
        },
        _links: {
          self: "/v1/accounts/acc_123456/transactions?page=1&limit=10",
          first: "/v1/accounts/acc_123456/transactions?page=1&limit=10",
          last: "/v1/accounts/acc_123456/transactions?page=1&limit=10",
        },
      },
      "401": {
        error: {
          code: "unauthorized",
          message: "Authentication required",
        },
      },
      "403": {
        error: {
          code: "forbidden",
          message: "Insufficient permissions to access transactions",
        },
      },
      "404": {
        error: {
          code: "not_found",
          message: "Account not found",
        },
      },
    },
    codeSamples: {
      curl: `curl -X GET "https://api.nexusbank.com/v1/accounts/acc_123456/transactions" \\
          -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`,
      node: `const fetchTransactions = async (accountId) => {
  const response = await fetch(\`https://api.nexusbank.com/v1/accounts/\${accountId}/transactions\`, {
            headers: {
            'Authorization': \`Bearer \${API_KEY}\`,
          'Content-Type': 'application/json'
    }
  });

          const data = await response.json();
          console.log(data);
          return data;
};

          fetchTransactions('acc_123456');`,
      python: `import requests

          def fetch_transactions(account_id):
          headers = {
            'Authorization': f'Bearer {API_KEY}',
          'Content-Type': 'application/json'
    }

          response = requests.get(
          f'https://api.nexusbank.com/v1/accounts/{account_id}/transactions',
          headers=headers
          )

          data = response.json()
          print(data)
          return data

          fetch_transactions('acc_123456')`,
      java: `import java.net.URI;
          import java.net.http.HttpClient;
          import java.net.http.HttpRequest;
          import java.net.http.HttpResponse;

          public String fetchTransactions(String accountId) throws Exception {
            HttpClient client = HttpClient.newHttpClient();
          HttpRequest request = HttpRequest.newBuilder()
          .uri(URI.create("https://api.nexusbank.com/v1/accounts/" + accountId + "/transactions"))
          .header("Authorization", "Bearer " + API_KEY)
          .header("Content-Type", "application/json")
          .GET()
          .build();

          HttpResponse<String> response = client.send(
            request, HttpResponse.BodyHandlers.ofString());

            System.out.println(response.body());
            return response.body();
}

            fetchTransactions("acc_123456");`,
    },
  },
]
