"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, StopCircle, CheckCircle2 } from "lucide-react"

interface SpeechToTextProps {
  onTranscript?: (text: string) => void
  onStart?: () => void
  onStop?: () => void
}

export function SpeechToText({ onTranscript, onStart, onStop }: SpeechToTextProps) {
  const recognitionRef = useRef<any>(null)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isFinal, setIsFinal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError("Speech Recognition not supported in this browser")
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = "en-IN"

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      setTranscript("")
      setError(null)
      onStart?.()
    }

    recognitionRef.current.onresult = (event: any) => {
      let interim = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcriptPart)
          setIsFinal(true)
          onTranscript?.(transcriptPart)
        } else {
          interim += transcriptPart
        }
      }
      if (interim) {
        setTranscript((prev) => prev.split(" ").slice(0, -1).join(" ") + " " + interim)
      }
    }

    recognitionRef.current.onerror = (event: any) => {
      setError(`Error: ${event.error}`)
      setIsListening(false)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
      onStop?.()
    }

    return () => {
      recognitionRef.current?.abort()
    }
  }, [onTranscript, onStart, onStop])

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript("")
      setIsFinal(false)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Speech to Text</CardTitle>
        <CardDescription>Convert your voice to text in real-time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="p-4 bg-muted rounded-lg min-h-20 flex items-center">
            {transcript ? (
              <div>
                <p className="text-sm mb-2">{transcript}</p>
                {isFinal && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Transcribed
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {isListening ? "Listening..." : "Click start to begin speaking"}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {!isListening ? (
            <Button onClick={startListening} className="flex-1 gap-2">
              <Mic className="h-4 w-4" />
              Start Recording
            </Button>
          ) : (
            <Button onClick={stopListening} variant="destructive" className="flex-1 gap-2">
              <StopCircle className="h-4 w-4" />
              Stop Recording
            </Button>
          )}
          <Button
            onClick={() => {
              setTranscript("")
              setIsFinal(false)
            }}
            variant="outline"
            className="bg-transparent"
          >
            Clear
          </Button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  )
}
