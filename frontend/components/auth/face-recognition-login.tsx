"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Camera, CheckCircle2, AlertCircle } from "lucide-react"

export function FaceRecognitionLogin() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { loginWithFaceRecognition } = useAuth()

  useEffect(() => {
    if (!isScanning) return

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        setErrorMessage("Unable to access camera. Please check permissions.")
        setStatus("error")
        setIsScanning(false)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [isScanning])

  const handleCapture = async () => {
    if (!canvasRef.current || !videoRef.current) return

    try {
      setStatus("scanning")
      const context = canvasRef.current.getContext("2d")
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const faceData = canvasRef.current.toDataURL("image/jpeg")

        await loginWithFaceRecognition(faceData)
        setStatus("success")
      }
    } catch (err) {
      setErrorMessage("Face recognition failed. Please try again.")
      setStatus("error")
    }
  }

  const handleStartScanning = () => {
    setIsScanning(true)
    setErrorMessage(null)
  }

  const handleCancel = () => {
    setIsScanning(false)
    setStatus("idle")
    setErrorMessage(null)
  }

  return (
    <div className="space-y-4">
      {!isScanning ? (
        <Button onClick={handleStartScanning} className="w-full bg-transparent" variant="outline">
          <Camera className="mr-2 h-4 w-4" />
          Enable Face Recognition
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover"
              onLoadedMetadata={() => {
                canvasRef.current?.setAttribute("width", videoRef.current?.videoWidth.toString() || "640")
                canvasRef.current?.setAttribute("height", videoRef.current?.videoHeight.toString() || "480")
              }}
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {status === "scanning" && (
            <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              Scanning face...
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
              Face recognized successfully
            </div>
          )}

          {status === "error" && errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={handleCapture} disabled={status === "scanning" || status === "success"} className="flex-1">
              {status === "scanning" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Capture & Verify"
              )}
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
