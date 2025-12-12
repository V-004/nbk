"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UPIPayment } from "@/components/payments/upi-payment"
import { IMPSNEFTTransfer } from "@/components/payments/imps-neft-transfer"
import { QRCodePayment } from "@/components/payments/qr-code-payment"
import { NFCPayment } from "@/components/payments/nfc-payment"
import { VirtualCard } from "@/components/payments/virtual-card"

export default function PaymentsPage() {
  const [selectedTab, setSelectedTab] = useState("upi")

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Payments</h1>
          <p className="text-sm text-muted-foreground">Multiple payment methods at your fingertips</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 gap-1">
            <TabsTrigger value="upi">UPI</TabsTrigger>
            <TabsTrigger value="imps">IMPS/NEFT</TabsTrigger>
            <TabsTrigger value="qr">QR Pay</TabsTrigger>
            <TabsTrigger value="nfc">NFC</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="upi">
              <UPIPayment />
            </TabsContent>

            <TabsContent value="imps">
              <IMPSNEFTTransfer />
            </TabsContent>

            <TabsContent value="qr">
              <QRCodePayment />
            </TabsContent>

            <TabsContent value="nfc">
              <NFCPayment />
            </TabsContent>

            <TabsContent value="cards" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <VirtualCard
                  cardNumber="4532111111111111"
                  expiryDate="12/27"
                  cvv="123"
                  cardHolder="John Doe"
                  limit={50000}
                  spent={18500}
                  status="active"
                />
                <VirtualCard
                  cardNumber="4532222222222222"
                  expiryDate="06/26"
                  cvv="456"
                  cardHolder="Jane Smith"
                  limit={100000}
                  spent={45000}
                  status="active"
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
