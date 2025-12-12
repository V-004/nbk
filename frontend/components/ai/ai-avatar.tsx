"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, Mic, StopCircle } from "lucide-react"

interface AIAvatarProps {
  isListening?: boolean
  isSpeaking?: boolean
  onStartListening?: () => void
  onStopListening?: () => void
  avatarMessage?: string
}

export function AIAvatar({
  isListening = false,
  isSpeaking = false,
  onStartListening,
  onStopListening,
  avatarMessage = "Hello! How can I help you today?",
}: AIAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrame = 0

    const drawAvatar = () => {
      ctx.fillStyle = "#f0f0f0"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw head
      ctx.fillStyle = "#FFD1A3"
      ctx.beginPath()
      ctx.arc(canvas.width / 2, 80, 50, 0, Math.PI * 2)
      ctx.fill()

      // Draw eyes
      ctx.fillStyle = "#333"
      const eyeOffsetX = isSpeaking ? Math.sin(animationFrame * 0.05) * 5 : 0
      ctx.beginPath()
      ctx.arc(canvas.width / 2 - 20 + eyeOffsetX, 70, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(canvas.width / 2 + 20 + eyeOffsetX, 70, 6, 0, Math.PI * 2)
      ctx.fill()

      // Draw mouth
      ctx.strokeStyle = "#333"
      ctx.lineWidth = 2
      ctx.beginPath()

      if (isSpeaking) {
        const mouthOpen = Math.abs(Math.sin(animationFrame * 0.15)) * 15
        ctx.arc(canvas.width / 2, 100, 15, 0.2, Math.PI - 0.2)
        ctx.stroke()

        // Draw sound waves
        ctx.strokeStyle = "#4F46E5"
        ctx.lineWidth = 1.5
        const waveOffset = animationFrame * 0.3
        for (let i = 0; i < 3; i++) {
          const waveRadius = 60 + i * 20 + (waveOffset % 20)
          const waveOpacity = 1 - (waveOffset % 20) / 20
          ctx.globalAlpha = waveOpacity
          ctx.beginPath()
          ctx.arc(canvas.width / 2, canvas.height / 2, waveRadius, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
      } else if (isListening) {
        ctx.arc(canvas.width / 2, 100, 12, 0, Math.PI)
        ctx.stroke()

        // Draw listening waves
        ctx.strokeStyle = "#10B981"
        ctx.lineWidth = 1.5
        const listenWaveOffset = animationFrame * 0.3
        for (let i = 0; i < 3; i++) {
          const waveRadius = 60 + i * 20 + (listenWaveOffset % 20)
          const waveOpacity = 1 - (listenWaveOffset % 20) / 20
          ctx.globalAlpha = waveOpacity
          ctx.beginPath()
          ctx.arc(canvas.width / 2, canvas.height / 2, waveRadius, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
      } else {
        ctx.arc(canvas.width / 2, 100, 10, 0, Math.PI)
        ctx.stroke()
      }

      animationFrame++
    }

    const animate = () => {
      drawAvatar()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isSpeaking, isListening])

  return (
    <Card className="w-full bg-gradient-to-b from-blue-50 to-white border-0 shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col items-center gap-6">
          <canvas ref={canvasRef} width={300} height={300} className="rounded-lg" />

          <div className="text-center space-y-4 max-w-md">
            <p className="text-lg font-semibold">
              {isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Ready"}
            </p>
            <p className="text-muted-foreground italic">{avatarMessage}</p>
          </div>

          <div className="flex gap-3">
            {!isListening ? (
              <Button onClick={onStartListening} className="gap-2" disabled={isSpeaking}>
                <Mic className="h-4 w-4" />
                Start Listening
              </Button>
            ) : (
              <Button onClick={onStopListening} variant="destructive" className="gap-2">
                <StopCircle className="h-4 w-4" />
                Stop
              </Button>
            )}

            <Button variant="outline" className="gap-2 bg-transparent">
              <Volume2 className="h-4 w-4" />
              Adjust Voice
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            {isListening && <p>Speak clearly to interact with the AI assistant</p>}
            {isSpeaking && <p>Your request is being processed</p>}
            {!isListening && !isSpeaking && <p>Click the microphone to start a conversation</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
