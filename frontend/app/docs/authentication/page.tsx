import type { Metadata } from "next"
import { CodeBlock } from "@/components/code-block"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, AlertTriangle } from "lucide-react"
import { TokenGenerator } from "@/components/token-generator"

export const metadata: Metadata = {
  title: "Authentication - NexusBank Developer Portal",
  description: "Learn how to authenticate with the NexusBank API",
}

export default function AuthenticationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Authentication</h1>
        <p className="text-xl text-muted-foreground">Learn how to authenticate your requests to the NexusBank API.</p>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">OAuth 2.0</h2>
        <p className="text-muted-foreground">
          NexusBank APIs use OAuth 2.0 for authentication. This industry-standard protocol provides secure access to
          protected resources while keeping sensitive credentials secure.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Authentication Flow</h2>
        <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
          <li>
            <strong>Register your application</strong> in the Developer Dashboard to obtain client credentials
            (client_id and client_secret).
          </li>
          <li>
            <strong>Request an access token</strong> using the OAuth 2.0 client credentials flow.
          </li>
          <li>
            <strong>Include the access token</strong> in the Authorization header of your API requests.
          </li>
          <li>
            <strong>Refresh the token</strong> when it expires to maintain continuous access.
          </li>
        </ol>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Token Expiration</AlertTitle>
        <AlertDescription>
          Access tokens are valid for 1 hour. You should implement token refresh logic in your application.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Obtaining an Access Token</h2>
        <p className="text-muted-foreground">To obtain an access token, make a POST request to the token endpoint:</p>

        <CodeBlock
          language="bash"
          code={`curl -X POST https://auth.nexusbank.com/oauth/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET"`}
        />

        <p className="text-muted-foreground">The response will include an access token and its expiration time:</p>

        <CodeBlock
          language="json"
          code={`{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "accounts payments"
}`}
        />
      </div>

      <div className="my-8">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4">Try It Now</h3>
        <TokenGenerator />
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Security Warning</AlertTitle>
        <AlertDescription>
          Never expose your client_secret in client-side code or public repositories. Always make token requests from
          your server.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Using the Access Token</h2>
        <p className="text-muted-foreground">
          Include the access token in the Authorization header of your API requests:
        </p>

        <CodeBlock
          language="bash"
          code={`curl https://api.nexusbank.com/v1/accounts \\
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Refreshing Access Tokens</h2>
        <p className="text-muted-foreground">
          When an access token expires, you can request a new one using the same client credentials flow. Implement
          token refresh logic in your application to handle token expiration gracefully.
        </p>

        <CodeBlock
          language="javascript"
          code={`// Example token refresh logic in Node.js
async function getAccessToken() {
  // Check if token exists and is not expired
  if (tokenData && tokenData.expiresAt > Date.now()) {
    return tokenData.accessToken;
  }
  
  // Request new token
  const response = await fetch('https://auth.nexusbank.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    }),
  });
  
  const data = await response.json();
  
  // Store token with expiration
  tokenData = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in * 1000),
  };
  
  return tokenData.accessToken;
}`}
        />
      </div>
    </div>
  )
}
