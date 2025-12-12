"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Scan, QrCode, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface QRScannerProps {
    onScan: (data: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
    const [open, setOpen] = useState(false)
    const [scanning, setScanning] = useState(false)
    const [scanned, setScanned] = useState(false)

    const startScan = () => {
        setScanning(true)
        setScanned(false)
        // Simulate scanning process
        setTimeout(() => {
            setScanning(false)
            setScanned(true)
            toast.success("QR Code Detected!")
            // Mock UPI Data
            const mockData = "merchant@nexus"
            setTimeout(() => {
                onScan(mockData)
                setOpen(false)
                setScanned(false)
            }, 1000)
        }, 3000)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                    <Scan className="mr-2 h-4 w-4" /> Open Scanner
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Scan QR Code</DialogTitle>
                    <DialogDescription>
                        Point your camera at any UPI QR code.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center p-6 gap-6 relative overflow-hidden bg-black/90 rounded-xl aspect-square">
                    {!scanning && !scanned && (
                        <>
                            <QrCode className="h-32 w-32 text-white/20" />
                            <Button onClick={startScan} className="z-10 bg-white text-black hover:bg-gray-200">
                                Start Camera
                            </Button>
                        </>
                    )}

                    {scanning && (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/20 to-transparent animate-scan z-0" />
                            <Loader2 className="h-12 w-12 text-green-500 animate-spin z-10" />
                            <p className="text-white z-10 font-medium animate-pulse">Scanning...</p>
                        </>
                    )}

                    {scanned && (
                        <div className="flex flex-col items-center animate-in zoom-in duration-300">
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                            <p className="text-green-500 font-bold mt-2">Verified</p>
                        </div>
                    )}

                    {/* Camera Corner Markers */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-white/50 rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-white/50 rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-white/50 rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-white/50 rounded-br-lg" />
                </div>
            </DialogContent>
        </Dialog>
    )
}
