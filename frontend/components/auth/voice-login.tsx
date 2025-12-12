"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Mic, CheckCircle2, AlertCircle } from "lucide-react"

export function VoiceLogin() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [status, setStatus] = useState<"idle" | "recording" | "processing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { loginWithVoice } = useAuth()

  useEffect(() => {
    if (!isRecording) return

    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording])

  const handleStartRecording = async () => {
    try {
      audioChunksRef.current = []
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data)
      })

      mediaRecorderRef.current.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setStatus("processing")

        try {
          await loginWithVoice(audioBlob)
          setStatus("success")
        } catch (err) {
          setErrorMessage("Voice authentication failed. Please try again.")
          setStatus("error")
        }

        stream.getTracks().forEach((track) => track.stop())
      })

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setStatus("recording")
      setRecordingTime(0)
      setErrorMessage(null)
    } catch (err) {
      setErrorMessage("Unable to access microphone. Please check permissions.")
      setStatus("error")
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      {status === "idle" && (
        <Button onClick={handleStartRecording} className="w-full bg-transparent" variant="outline">
          <Mic className="mr-2 h-4 w-4" />
          Enable Voice Login
        </Button>
      )}

      {status === "recording" && (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 bg-blue-50 p-6 rounded-lg">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-8 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
            <div className="text-center">
              <p className="font-semibold text-blue-900">Recording...</p>
              <p className="text-2xl font-mono text-blue-700">{formatTime(recordingTime)}</p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">Say your voice passphrase clearly</p>

          <Button onClick={handleStopRecording} className="w-full">
            Stop Recording
          </Button>
        </div>
      )}

      {status === "processing" && (
        <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing voice...
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
          <CheckCircle2 className="h-4 w-4" />
          Voice authenticated successfully
        </div>
      )}

      {status === "error" && errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
