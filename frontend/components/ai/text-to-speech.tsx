"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Volume2, StopCircle } from "lucide-react"

interface TextToSpeechProps {
  defaultText?: string
  onSpeak?: (text: string) => void
}

export function TextToSpeech({ defaultText = "", onSpeak }: TextToSpeechProps) {
  const [text, setText] = useState(defaultText)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voice, setVoice] = useState<"female-natural" | "male-natural" | "female-professional">("female-natural")
  const [rate, setRate] = useState(1)
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null

  const handleSpeak = () => {
    if (!text || !synth) return

    if (synth.speaking) {
      synth.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = voice === "male-natural" ? 0.8 : 1.2
    utterance.volume = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synth.speak(utterance)
    onSpeak?.(text)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text to Speech</CardTitle>
        <CardDescription>Convert text to natural-sounding speech</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Text to Speak</label>
          <Textarea
            placeholder="Enter text you want to hear..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Voice</label>
            <Select value={voice} onValueChange={(v) => setVoice(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female-natural">Female Natural</SelectItem>
                <SelectItem value="male-natural">Male Natural</SelectItem>
                <SelectItem value="female-professional">Female Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Speed: {rate.toFixed(1)}x</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number.parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <Button onClick={handleSpeak} className="w-full gap-2" disabled={!text}>
          {isSpeaking ? (
            <>
              <StopCircle className="h-4 w-4" />
              Stop Speaking
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              Speak
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
