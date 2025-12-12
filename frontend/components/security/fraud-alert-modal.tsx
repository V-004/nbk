"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, MapPin, Smartphone } from "lucide-react"

interface FraudAlertModalProps {
  isOpen: boolean
  onClose: () => void
  alertType: "suspicious_location" | "unusual_amount" | "multiple_failed_attempts" | "new_device"
  title: string
  description: string
  actions: {
    label: string
    onClick: () => void
    variant?: "default" | "destructive"
  }[]
}

export function FraudAlertModal({ isOpen, onClose, alertType, title, description, actions }: FraudAlertModalProps) {
  const getIcon = () => {
    switch (alertType) {
      case "suspicious_location":
        return <MapPin className="h-12 w-12 text-red-600" />
      case "new_device":
        return <Smartphone className="h-12 w-12 text-orange-600" />
      default:
        return <AlertTriangle className="h-12 w-12 text-red-600" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">{getIcon()}</div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-base">{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {alertType === "suspicious_location" && (
            <Alert className="bg-orange-50 border-orange-200">
              <MapPin className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-900">
                Login detected from New Delhi, India at 2:45 PM. This is different from your usual location.
              </AlertDescription>
            </Alert>
          )}

          {alertType === "new_device" && (
            <Alert className="bg-blue-50 border-blue-200">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                New device detected: iPhone 15 Pro. Please verify this device to ensure your account security.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            {actions.map((action, index) => (
              <Button key={index} onClick={action.onClick} variant={action.variant} className="w-full" disabled={false}>
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
