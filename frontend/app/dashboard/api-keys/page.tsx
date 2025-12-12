"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Key, Plus, RefreshCw, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock API keys data
const mockApiKeys = [
  {
    id: "key_1",
    name: "Production API Key",
    prefix: "pk_live_",
    suffix: "...a1b2c3",
    created: "2023-04-15T10:30:00Z",
    environment: "production",
    status: "active",
  },
  {
    id: "key_2",
    name: "Sandbox Testing",
    prefix: "pk_test_",
    suffix: "...d4e5f6",
    created: "2023-05-20T14:45:00Z",
    environment: "sandbox",
    status: "active",
  },
  {
    id: "key_3",
    name: "Old Production Key",
    prefix: "pk_live_",
    suffix: "...g7h8i9",
    created: "2022-11-10T09:15:00Z",
    environment: "production",
    status: "revoked",
    revoked: "2023-04-15T10:29:00Z",
  },
]

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState(mockApiKeys)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyEnvironment, setNewKeyEnvironment] = useState("sandbox")
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)

  const handleCreateKey = () => {
    // In a real app, this would make an API call to create a new key
    const prefix = newKeyEnvironment === "production" ? "pk_live_" : "pk_test_"
    const randomSuffix = Math.random().toString(36).substring(2, 10)
    const fullKey = `${prefix}${randomSuffix}`

    const newKeyObj = {
      id: `key_${apiKeys.length + 1}`,
      name: newKeyName,
      prefix,
      suffix: `...${randomSuffix.substring(randomSuffix.length - 6)}`,
      created: new Date().toISOString(),
      environment: newKeyEnvironment,
      status: "active",
    }

    setApiKeys([...apiKeys, newKeyObj])
    setNewKey(fullKey)
    setNewKeyName("")
    setNewKeyEnvironment("sandbox")
  }

  const handleRevokeKey = (keyId: string) => {
    // In a real app, this would make an API call to revoke the key
    setApiKeys(
      apiKeys.map((key) =>
        key.id === keyId
          ? {
              ...key,
              status: "revoked",
              revoked: new Date().toISOString(),
            }
          : key,
      ),
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="text-muted-foreground">Manage your API keys for authenticating with NexusBank APIs.</p>
      </div>

      <div className="flex justify-between items-center">
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active Keys</TabsTrigger>
            <TabsTrigger value="revoked">Revoked Keys</TabsTrigger>
          </TabsList>
          <div className="flex justify-end my-4">
            <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                {newKey ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>Your New API Key</DialogTitle>
                      <DialogDescription>
                        This key will only be displayed once. Please copy it now and store it securely.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Alert className="bg-yellow-50 dark:bg-yellow-950">
                        <Key className="h-4 w-4" />
                        <AlertTitle>Important!</AlertTitle>
                        <AlertDescription>
                          This key will only be shown once. If you lose it, you'll need to generate a new one.
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-2">
                        <Label>API Key</Label>
                        <div className="flex items-center gap-2">
                          <Input value={newKey} readOnly className="font-mono" />
                          <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(newKey)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          setNewKey(null)
                          setShowNewKeyDialog(false)
                        }}
                      >
                        Done
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                      <DialogDescription>
                        Create a new API key for authenticating with NexusBank APIs.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="key-name">Key Name</Label>
                        <Input
                          id="key-name"
                          placeholder="My Application"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="key-environment">Environment</Label>
                        <select
                          id="key-environment"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={newKeyEnvironment}
                          onChange={(e) => setNewKeyEnvironment(e.target.value)}
                        >
                          <option value="sandbox">Sandbox</option>
                          <option value="production">Production</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowNewKeyDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateKey} disabled={!newKeyName}>
                        Create Key
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
          <TabsContent value="active" className="space-y-4">
            {apiKeys.filter((key) => key.status === "active").length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Key className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Active API Keys</h3>
                  <p className="text-sm text-muted-foreground mb-4">You don't have any active API keys yet.</p>
                  <Button onClick={() => setShowNewKeyDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New API Key
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {apiKeys
                  .filter((key) => key.status === "active")
                  .map((key) => (
                    <Card key={key.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{key.name}</h3>
                              <Badge variant={key.environment === "production" ? "default" : "secondary"}>
                                {key.environment}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="text-sm font-mono">
                                {key.prefix}
                                {key.suffix}
                              </code>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Created on {new Date(key.created).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <RefreshCw className="mr-2 h-3 w-3" />
                              Rotate
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleRevokeKey(key.id)}>
                              <Trash2 className="mr-2 h-3 w-3" />
                              Revoke
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="revoked" className="space-y-4">
            {apiKeys.filter((key) => key.status === "revoked").length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Key className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Revoked API Keys</h3>
                  <p className="text-sm text-muted-foreground">You don't have any revoked API keys.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {apiKeys
                  .filter((key) => key.status === "revoked")
                  .map((key) => (
                    <Card key={key.id} className="opacity-70">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{key.name}</h3>
                              <Badge variant="outline">Revoked</Badge>
                              <Badge variant={key.environment === "production" ? "default" : "secondary"}>
                                {key.environment}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="text-sm font-mono">
                                {key.prefix}
                                {key.suffix}
                              </code>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Created on {new Date(key.created).toLocaleDateString()} • Revoked on{" "}
                              {new Date(key.revoked!).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Key Security</CardTitle>
          <CardDescription>Best practices for managing your API keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Never expose your API keys in client-side code or public repositories.</li>
            <li>Store API keys in environment variables or a secure vault.</li>
            <li>Rotate your API keys regularly for enhanced security.</li>
            <li>Use different API keys for different environments (sandbox vs. production).</li>
            <li>Revoke API keys that are no longer needed or may have been compromised.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
