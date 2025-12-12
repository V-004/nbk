import type { Metadata } from "next"
import { CodeBlock } from "@/components/code-block"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export const metadata: Metadata = {
  title: "Payments API - NexusBank Developer Portal",
  description: "Documentation for the NexusBank Payments API",
}

export default function PaymentsApiPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Payments API</h1>
        <p className="text-xl text-muted-foreground">Initiate and track payments across various payment methods.</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Base URL</AlertTitle>
        <AlertDescription>
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            https://api.nexusbank.com/v1/payments
          </code>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Endpoints</h2>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Create Payment</h3>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
                POST
              </span>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">/v1/payments</code>
            </div>
            <p className="text-muted-foreground">
              Initiate a new payment from a source account to a destination account.
            </p>

            <div className="space-y-2">
              <h4 className="font-medium">Request Body</h4>
              <CodeBlock
                language="json"
                code={`{
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
  "reference": "INV-123",
  "execution_date": "2023-05-15T00:00:00Z"  // Optional, defaults to immediate execution
}`}
              />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Response</h4>
              <CodeBlock
                language="json"
                code={`{
  "id": "pmt_789012",
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
  "reference": "INV-123",
  "status": "pending",
  "execution_date": "2023-05-15T00:00:00Z",
  "created_at": "2023-05-10T14:30:00Z",
  "_links": {
    "self": "/v1/payments/pmt_789012"
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
const createPayment = async () => {
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

createPayment();
                `}
                />
              </TabsContent>
              <TabsContent value="python">
                <CodeBlock
                  language="python"
                  code={`
import requests
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

create_payment()
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
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

async Task<string> CreatePayment()
{
    var payment = new
    {
        source_account_id = "acc_123456",
        destination = new
        {
            type = "iban",
            iban = "DE89370400440532013000",
            bic = "DEUTDEFFXXX",
            name = "John Doe"
        },
        amount = 100.50,
        currency = "EUR",
        description = "Invoice payment #123",
        reference = "INV-123"
    };

    using (HttpClient client = new HttpClient())
    {
        client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", API_KEY);
            
        var content = new StringContent(
            JsonSerializer.Serialize(payment),
            Encoding.UTF8,
            "application/json");
            
        HttpResponseMessage response = await client.PostAsync(
            "https://api.nexusbank.com/v1/payments", content);
        
        response.EnsureSuccessStatusCode();
        string responseBody = await response.Content.ReadAsStringAsync();
        Console.WriteLine(responseBody);
        return responseBody;
    }
}

await CreatePayment();
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

createPayment();
                `}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">Get Payment Status</h3>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-medium">
                GET
              </span>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                /v1/payments/{"{payment_id}"}
              </code>
            </div>
            <p className="text-muted-foreground">Retrieve the current status and details of a specific payment.</p>

            <div className="space-y-2">
              <h4 className="font-medium">Path Parameters</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>
                  <code>payment_id</code> (required): The unique identifier of the payment
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Response</h4>
              <CodeBlock
                language="json"
                code={`{
  "id": "pmt_789012",
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
  "reference": "INV-123",
  "status": "completed",
  "execution_date": "2023-05-15T00:00:00Z",
  "completed_at": "2023-05-15T00:05:23Z",
  "created_at": "2023-05-10T14:30:00Z",
  "_links": {
    "self": "/v1/payments/pmt_789012"
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
