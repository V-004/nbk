import type { Metadata } from "next"
import { CodeBlock } from "@/components/code-block"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export const metadata: Metadata = {
  title: "Accounts API - NexusBank Developer Portal",
  description: "Documentation for the NexusBank Accounts API",
}

export default function AccountsApiPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Accounts API</h1>
        <p className="text-xl text-muted-foreground">
          Retrieve account details, balances, and manage account settings.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Base URL</AlertTitle>
        <AlertDescription>
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            https://api.nexusbank.com/v1/accounts
          </code>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Endpoints</h2>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Get All Accounts</h3>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
                GET
              </span>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">/v1/accounts</code>
            </div>
            <p className="text-muted-foreground">
              Retrieve a list of all accounts associated with the authenticated user.
            </p>

            <div className="space-y-2">
              <h4 className="font-medium">Query Parameters</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>
                  <code>page</code> (optional): Page number for pagination (default: 1)
                </li>
                <li>
                  <code>limit</code> (optional): Number of results per page (default: 10, max: 100)
                </li>
                <li>
                  <code>status</code> (optional): Filter by account status (active, inactive, closed)
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Response</h4>
              <CodeBlock
                language="json"
                code={`{
  "data": [
    {
      "id": "acc_123456",
      "name": "Main Account",
      "type": "checking",
      "currency": "EUR",
      "balance": 1500.75,
      "available_balance": 1500.75,
      "status": "active",
      "created_at": "2023-01-15T08:30:00Z",
      "_links": {
        "self": "/v1/accounts/acc_123456",
        "transactions": "/v1/accounts/acc_123456/transactions"
      }
    },
    {
      "id": "acc_789012",
      "name": "Savings Account",
      "type": "savings",
      "currency": "EUR",
      "balance": 5000.00,
      "available_balance": 5000.00,
      "status": "active",
      "created_at": "2023-02-20T14:15:00Z",
      "_links": {
        "self": "/v1/accounts/acc_789012",
        "transactions": "/v1/accounts/acc_789012/transactions"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  },
  "_links": {
    "self": "/v1/accounts?page=1&limit=10",
    "first": "/v1/accounts?page=1&limit=10",
    "last": "/v1/accounts?page=1&limit=10"
  }
}`}
              />
            </div>

            <Tabs defaultValue="node" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="node">Node.js</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="csharp">C#</TabsTrigger>
                <TabsTrigger value="java">Java</TabsTrigger>
              </TabsList>
              <TabsContent value="node">
                <CodeBlock
                  language="javascript"
                  code={`
const fetchAccounts = async () => {
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

fetchAccounts();
                `}
                />
              </TabsContent>
              <TabsContent value="python">
                <CodeBlock
                  language="python"
                  code={`
import requests

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

fetch_accounts()
                `}
                />
              </TabsContent>
              <TabsContent value="csharp">
                <CodeBlock
                  language="csharp"
                  code={`
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

async Task<string> FetchAccounts()
{
    using (HttpClient client = new HttpClient())
    {
        client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", API_KEY);
            
        HttpResponseMessage response = await client.GetAsync(
            "https://api.nexusbank.com/v1/accounts");
        
        response.EnsureSuccessStatusCode();
        string responseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine(responseBody);
        return responseBody;
    }
}

await FetchAccounts();
                `}
                />
              </TabsContent>
              <TabsContent value="java">
                <CodeBlock
                  language="java"
                  code={`
import java.net.URI;
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

fetchAccounts();
                `}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Get Account Details</h3>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
                GET
              </span>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                /v1/accounts/{"{account_id}"}
              </code>
            </div>
            <p className="text-muted-foreground">Retrieve detailed information about a specific account.</p>

            <div className="space-y-2">
              <h4 className="font-medium">Path Parameters</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>
                  <code>account_id</code> (required): The unique identifier of the account
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Response</h4>
              <CodeBlock
                language="json"
                code={`{
  "id": "acc_123456",
  "name": "Main Account",
  "type": "checking",
  "currency": "EUR",
  "balance": 1500.75,
  "available_balance": 1500.75,
  "status": "active",
  "iban": "DE89370400440532013000",
  "bic": "NEXUBANKXXX",
  "owner": {
    "id": "usr_789012",
    "name": "Jane Doe"
  },
  "created_at": "2023-01-15T08:30:00Z",
  "updated_at": "2023-05-10T14:20:00Z",
  "_links": {
    "self": "/v1/accounts/acc_123456",
    "transactions": "/v1/accounts/acc_123456/transactions"
  }
}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
